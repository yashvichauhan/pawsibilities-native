# Pawsibilities React Native frontend

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
