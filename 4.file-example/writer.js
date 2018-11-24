const Rx = require('rxjs');
const {
    join
} = require('path');
const {
    writeFile,
} = require('fs');

const {
    map,
    mergeMap,
    toArray
} = require('rxjs/operators');

const RANGE = 2;


const write = item =>
    Rx.bindNodeCallback(writeFile)(
        join(__dirname, `temp/file-${item.count}.json`),
        JSON.stringify(item.items),
    );

Rx.interval(1000)
    .pipe(
        mergeMap(e =>
            Rx.range(0, RANGE)
            .pipe(
                map(index => ({
                    name: `Fulano ${index + e * RANGE}`,
                    age: index * 2,
                })),
                toArray(),
            )
            .pipe(
                map(item => ({
                    count: e,
                    items: item
                }))
            ),
        ),
    )
    .pipe(mergeMap(i => write(i).pipe(mergeMap(j => Rx.of(i)))))
    .subscribe(console.log, error => console.error('errouuuu', error.message));