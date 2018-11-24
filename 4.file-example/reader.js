const Rx = require('rxjs');
const {
    readFile,
    watch,
    mkdir
} = require('fs');
const {
    join
} = require('path');
const {
    map,
    mergeMap,
    retry,
    catchError,
    delayWhen,
    tap,
    retryWhen
} = require('rxjs/operators');

const watchDir = directory => {
    console.log(`Wating for changes at ${directory}`);
    return Rx.Observable.create(observer => {
        watch(directory, (eventType, filename) => {
            console.log(`Event raised! type: ${eventType}`);
            return observer.next({
                eventType,
                filename: `${directory}/${filename.toString()}`,
            });
        });
    });
};
watchDir(join(__dirname, 'temp'))
    .pipe(
        mergeMap(e => Rx.bindNodeCallback(readFile)(e.filename)),
        retryWhen(errors =>
            Rx.bindNodeCallback(mkdir)('temp')
            .pipe(
                //log error message
                tap(val => console.log(`Creating folder!`)),
                delayWhen(val => timer(0)),
            ),
        )
    )

    .pipe(
        map(JSON.parse),
        retry(error => Rx.of([])),
    )
    .pipe(mergeMap(e => Rx.from(e)))

    .subscribe(
        result => {
            console.log(`
    ********
        Nome: ${result.name},
        Idade: ${result.age}
    `);
        },
        error => console.error(`errror`, error),
        () => console.log('process finished!')
    );