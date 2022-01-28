# Treat maven-dependency-plugin log information

This script tries to solve the problem of consuming maven-dependency-plugin information from multiple modules from multiple projects.

## Let's clarify the problem it tries to cover

What happens whenever you want to upgrade a library but you need to analyze the side effect of this new library version with the rest of the projects in you organization? Imagine you have more than a thousand maven modules involved? How would you do it? Well... `treat-maven-dependency-plubin-log` proposes a simple and easy way to do it. Just run your `mvn dependency:tree` command for all of your projects and save the log into a file and then run the tool to filter (by regular expressions filters) the artifacts you want to filter from maven-dependency-plugin:tree output. The maven-dependency-plugin:tree output from every module matching the filter will be summarize in one single place module by module, like

```
###########################################
jbpm-workitems-rest
###########################################

[INFO] org.jbpm:jbpm-workitems-rest:jar:7.64.0-SNAPSHOT
[INFO] +- org.apache.cxf:cxf-rt-transports-http-jetty:jar:3.3.9:test
[INFO] |  +- org.apache.cxf:cxf-core:jar:3.3.9:test
...
...

###########################################
kie-server-spring-boot-autoconfiguration
###########################################

[INFO] org.kie:kie-server-spring-boot-autoconfiguration:jar:7.64.0-SNAPSHOT
[INFO] +- org.springframework.boot:spring-boot:jar:2.3.4.RELEASE:compile
...

and so on and so on...
```

### Real world example

We wanted to move our [droolsjbpm-build-bootstrap](https://github.com/kiegroup/droolsjbpm-build-bootstrap) org.apache.cxf:3.3.9 dependency to org.apache.cxf:3.4.5, easy right? (See [RHPAM-4012](https://issues.redhat.com/browse/RHPAM-4012)). Then we noticed comes with `jakarta.validation:jakarta.validation-api:2.0.2` and all the projects depending on it (more than 30) are still using the old `javax.validation:validation-api:2.0.1`, but... how deep the impact for this change is? we needed to measure it and we came to the conclusion we needed to automatize it somehow. We execute a full downstream build for this specific project just running `mvn dependency:tree` and we stored the output in one single file but now it's time to consume this huge amount of information, so... we decided to create this tool to do the hard work for us by just running commands like

`treat-maven-dependency-plubin-log -l thelogfile.log -f "\] \+- org.apache.cxf:cxf.*:jar:3.3.9" "validation-api" -p`
`treat-maven-dependency-plubin-log -l thelogfile.log -f "\] \+- org.apache.cxf:cxf.*:jar:3.3.9" "validation-api" -e "org.kie.soup:kie-soup-dataset-api" -p`
etc...

## Installation and execution

Just install

```
npm install -g treat-maven-dependency-plugin-log
```

and execute

```
treat-maven-dependency-plugin-log -l <filePath>
```

being `<filePath>` and absolute or relative path to the maven log file where the `mvn dependency:tree` output was stored.

## Arguments

- `-l, --log-file-path <filePath>`: The maven log file path
- `-o, --output-file <filePath>`: The file path to write the output information from the execution
- `-f, --filter <regex...>`: The regex list to filter just the modules' dependency:tree matching with the regex. For instance `-f validator-api:\d` will filter just the modules where the dependency tree matches `validator-api:\d` regular expression.
- `-e, --exclude <regex...>`: The regex list to exclude the modules' dependency:tree matching with the regex. For instance `-e validator-api:\d` will exclude all the modules where the dependency tree matches `validator-api:\d` regular expression.
- `--skip-output`: Will skip output to be written on any file. This invalidates the `-o` argument.
- `-p ,--print-module-list`: It will print out a summary of module lists matching the requirements from execution.
- `-a ,--artifacts <dependency identifier...>`: It will print out specific artifact information like at which level and which modules this artifact appear.
