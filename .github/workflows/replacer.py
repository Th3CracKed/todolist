import argparse

parser = argparse.ArgumentParser()

# Add long and short argument
parser.add_argument("--envPath", required=True, help="Path where files are stored")
parser.add_argument("--apiKey", required=True, help="Set Api Key")
parser.add_argument("--authDomain", required=True, help="Set Auth Domain")
parser.add_argument("--databaseURL", required=True, help="Set Database URL")
parser.add_argument("--projectId", required=True, help="Set Project Id")
parser.add_argument("--storageBucket", required=True, help="Set Storage bucket")
parser.add_argument("--messagingSenderId", required=True, help="Set Messaging Sender Id")
parser.add_argument("--appId", required=True, help="Set App Id")
parser.add_argument("--measurementId", required=True, help="Set Measurement Id")


# Read arguments from the command line
args = parser.parse_args()
    

fin = open(args.envPath + str("environment.example.ts"), "rt")
try:
  with open(args.envPath + str('environment.ts'), 'wt') as envDev, open(args.envPath + str('environment.prod.ts'), 'wt') as envProd:
    for line in fin:
        line = line.replace('API_KEY', args.apiKey)
        line = line.replace('AUTH_DOMAIN', args.authDomain)
        line = line.replace('DATABASE_URL', args.databaseURL)
        line = line.replace('PROJECT_ID', args.projectId)
        line = line.replace('STORAGE_BUCKET', args.storageBucket)
        line = line.replace('Messaging_Sender_ID', args.messagingSenderId)
        line = line.replace('APP_ID', args.appId)
        line = line.replace('Measurement_Id', args.measurementId)
        envDev.write(line)
        envProd.write(line)
except IOError as e:
  print 'Operation failed: %s' % e.strerror
	
fin.close()
envDev.close()
envProd.close()