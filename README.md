# Treat maven-dependency-plugin log information

This script tries to solve the problem of consuming maven-dependency.plugin information from multiple modules.

Just install

```
npm install -g treat-maven-dependency-plugin-log
```

and execute

```
treat-maven-dependency-plugin-log -l <filePath>
```

being `<filePath>` and absoloute or relative path to the maven log file where the `mvn dependency:tree` output was stored.

## Arguments

- `-l --log-file-path <filePath>`: The maven log file path
- `-o, --output-file <filePath>`: The file path to write the output information from the execution
- `-f --filter <regex>`: The regex to filter just the modules' dependency:tree matching with the regex. For instance `-f validator-api:\d` will filter just the modules where the dependency tree matches `validator-api:\d` regular expression.
