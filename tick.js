try {

    // tick every 10 seconds
    setInterval(() => process.stdout.write(`Ici ${ process.env[`CONTAINER_NAME`] }, il est ${ new Date().toLocaleTimeString(`fr-FR`) }\n`), 1e3);

    process.on(`SIGTERM`, () => {
        // log SIGTERM reception
        process.stdout.write(`Ici ${ process.env[`CONTAINER_NAME`] }, on stoppe le conteneur.\n`);
        // success
        process.exit(0);
    });

} catch (err) {
    // write to stderr
    process.stderr.write(`error occured: ${ err.message }`);
    // failure
    process.exit(1);
}