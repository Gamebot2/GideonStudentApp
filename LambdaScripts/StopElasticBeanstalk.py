import boto3

envid = ['e-xminr4nqkh']
client = boto3.client('elasticbeanstalk')


def handler(event, context):
    try:
        for appid in range(len(envid)):
            response = client.terminate_environment(EnvironmentId=str(envid[appid].strip()))
            if response:
                print('Terminating environment %s' % str(envid[appid]))
            else:
                print('Failed to Terminate environment %s' % str(envid[appid]))

    except Exception as e:
        print('EnvironmentID is not valid')