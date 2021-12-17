# Treat maven-dependency-plugin log information

This script tries to solve the problem of consuming maven-dependency.plugin information from multiple modules.

Just install

```
npm install -g treat-maven-dependency-plugin-log
```

and execute

```
treat-maven-dependency-plugin-log PATH_TO_THE_FILE
```

being `PATH_TO_THE_FILE` and absoloute or relative path to the maven log file where the `mvn dependency:tree` output was stored.
