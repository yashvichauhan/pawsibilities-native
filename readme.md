# Pawsibilities React Native frontend
An iOS and Android application to connect pet owners with adopters, using React Native, Node.js and MongoDB leveraging Geolocation API and AWS S3. Built a secure backend with JWT auth and RBAC, integrated AWS Rekognition for pet image matching, Geolocation API for proximity-based search, and AWS S3 for media storage.


<img width="210" height="400" alt="202 Owner Home" src="https://github.com/user-attachments/assets/f6c9e901-3898-4a1d-8379-1560a4bfed38" />
<img width="200" height="400" alt="302 Adopter Home" src="https://github.com/user-attachments/assets/21563677-8d2f-4e41-9a2c-1ab12fbc77ec" />
<img width="200" height="400" alt="311 Adopter View Pets" src="https://github.com/user-attachments/assets/1030d1d8-4cd1-4b6f-a7ac-d52284e78879" />
<img width="210" height="400" alt="225 Owner Post Pet 5" src="https://github.com/user-attachments/assets/913d09a1-ad00-41bb-bccf-12cb33ab57f3" />


# Start the project

```shell
npm install
npx expo start
```

# Troubleshooting

## Stuck in "Welcom to Expo" screen

In case the project shows up only the default Expo screen "Welcome to Expo" instead of this application, you may try:

Usually the following will fix the issue.

```shell
watchman watch-del-all
npx expo start -c
```

The following commands will clean other caches as well.

```shell
rm -rf .expo
rm -rf node_modules/.cache

npm cache clean --force

rm -rf node_modules package-lock.json
npm install

watchman watch-del-all
npx expo start -c
```

## EMFILE: too many open files

Below command might need to increase the maximum file size so that we don’t have EMFILE: too many open files, watch error (please use appropriate alternate command for windows)

```shell
sudo sysctl -w kern.maxfiles=10485760
sudo sysctl -w kern.maxfilesperproc=1048576
```

# Project Creation

The following command has been used to create the project:

```shell
# Create ReactNative project using Expo
npx create-expo-app --template

# Install watchman on MacOS
brew install watchman
# Install watchman on Windows
choco install watchman

# Install dependencies
npm install

# Start the project
run npx expo start
```
