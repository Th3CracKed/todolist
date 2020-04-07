import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
admin.initializeApp();
import * as R from 'ramda';


export const deleteTasksOnListDelete = functions.firestore
    .document(`todoLists/{id}`)
    .onDelete(async snapshot => {
        const todoListId = snapshot.id
        const db = admin.firestore();
        const query = db.collection('tasks').where('listId', '==', todoListId).limit(50);
        return new Promise((resolve, reject) => {
            deleteQueryBatch(db, query, resolve, reject);
        });
    }
    )

function deleteQueryBatch(db: FirebaseFirestore.Firestore, query: FirebaseFirestore.Query<FirebaseFirestore.DocumentData>, resolve: { (value?: unknown): void; }, reject: (reason?: any) => void) {
    query.get()
        .then((snapshot) => {
            // When there are no documents left, we are done
            if (snapshot.size === 0) {
                return 0;
            }

            // Delete documents in a batch
            const batch = db.batch();
            snapshot.docs.forEach((doc) => {
                batch.delete(doc.ref);
            });

            return batch.commit().then(() => {
                return snapshot.size;
            });
        }).then((numDeleted) => {
            if (numDeleted === 0) {
                resolve();
                return;
            }

            // Recurse on the next process tick, to avoid
            // exploding the stack.
            process.nextTick(() => {
                deleteQueryBatch(db, query, resolve, reject);
            });
        })
        .catch(reject);
}

export const sendOnFirestoreUpdate = functions.firestore
    .document(`todoLists/{id}`)
    .onUpdate(async snapshot => {
        const todoList = snapshot.before.data()
        const members = R.pathOr({}, ['members'], todoList);

        const todoList2 = snapshot.after.data()
        const members2 = R.pathOr({}, ['members'], todoList2);
        const listChanges = findTheChanges(members, members2);
        const userId = Object.keys(listChanges)[0];
        const sharedWith = listChanges[userId];
        const coreMember = (<any>members)[userId];
        if (userId) {
            const notification = await getNotification(todoList, sharedWith, coreMember);
            const payload: admin.messaging.MessagingPayload = {
                notification
            }
            const fcmTokens = await admin.firestore().collection(`/fcmTokens`).doc(userId).get()
            const token: string = (<any>fcmTokens.data()).value;

            // send notification
            return token ? admin.messaging().sendToDevice(token, payload) : undefined;
        }

        return undefined;
    })

async function getNotification(todoList: any, newObject: any, oldObject: any) {
    const ownerName = await getOwnerName(todoList);
    let title, body = `${ownerName}`;
    if (R.isNil(newObject)) {
        title = 'Access Revoked';
        body += ` revoke access to a list shared previously`
    } else {
        if (R.isNil(oldObject)) {
            title = 'New List is available!';
            body += ` shared his list with you`
        } else {
            title = 'Update!';
            body += ' changed access you had'
        }
        body += newObject.canEdit ? `, with write access` : `, with read access only`;
    }
    const notification = {
        title: title,
        body: body
    }
    return notification;
}

async function getOwnerName(todoList: any) {
    const userId = todoList.userId;
    let ownerName;
    if (userId) {
        const todoListOwner = await admin.firestore().collection('/users').doc(userId).get()
        const lastName = (<any>todoListOwner.data()).lastName;
        const firstName = (<any>todoListOwner.data()).firstName;
        ownerName = firstName ? `${lastName} ${firstName}` : lastName || 'Someone';
        return ownerName;
    } else {
        return 'Someone'
    }
}


/**
 * Keep fields that have different value
 */
function findTheChanges(oldObject: any, newObject: any): any {
    const results = R.union(Object.keys(oldObject), Object.keys(newObject))
        .map(key => {
            if (!R.isNil(oldObject[key]) || !R.isNil(newObject[key])) {
                if (!R.equals(oldObject[key], newObject[key])) {
                    return <any>{ [key]: newObject[key] };
                }
            }
            return undefined;
        }).filter(result => !R.isNil(result));
    return R.mergeAll(results);
}
