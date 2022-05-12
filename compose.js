// import primitives
import {once} from "events";
// import modules
import {fileStreamer} from "@mulekick/file-streamer";

(async() => {

    try {

        const
            // file
            [ file ] = process.argv.slice(2),
            // reader (4 bytes)
            streamer = new fileStreamer({bufSize: 4, errorOnMissing: true, closeOnEOF: false});

        streamer
            // attach file streamer handlers
            .on(`reading`, () => console.debug(`file streamer: reading file contents ...`))
            .on(`paused`, () => console.debug(`file streamer: reading paused.`))
            .on(`stopped`, () => console.debug(`file streamer: reading stopped.`))
            // mandatory error event handler for EventEmitter (stack trace + exit if missing)
            .on(`error`, err => console.debug(`error: file streamer emitted ${ err.message }.`));

        // open
        await streamer.promise(`open`, file);

        streamer
            // stream file contents
            .stream()
            // attach readable stream handlers
            .on(`end`, () => console.debug(`file streamer: readable stream received EOF.`))
            .on(`close`, () => console.debug(`file streamer: readable stream closed.`))
            .on(`error`, err => console.debug(`file streamer: readable stream emitted error ${ err.message }.`))
            // pipe
            .pipe(process.stdout);

        // notify Ctrl-C
        process.on(`SIGINT`, () => console.debug(`\n(node) received SIGINT, stopping and exiting.`));

        // wait for SIGINT
        await once(process, `SIGINT`);

        // close
        await streamer.promise(`close`);

    } catch (err) {
        // write to stderr
        console.error(`error occured: ${ err.message }.\n`);
    }

})();