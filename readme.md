# Pawsibilities React Native frontend

# Start

```shell
npm install
npx expo start
```

# Troubleshooting

In case the project shows up only the default Expo screen "Welcome to Expo" instead of this application, you may try:

Usually the following will fix the issue.

```shell
watchman watch-del-all
npx expo start -c
```

The following will clean other caches as well.

```shell
rm -rf .expo
rm -rf node_modules/.cache

npm cache clean --force

rm -rf node_modules package-lock.json
npm install

watchman watch-del-all
npx expo start -c
```
