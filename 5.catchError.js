const {
    throwError,
    of
} = require('rxjs');
const {
    catchError
} = require('rxjs/operators');

//emit error
const source = throwError('This is an error!');

const example = source.pipe(
    catchError(val => of (`I caught: ${val}`))
);

//output: 'I caught: This is an error'
example.subscribe(val => console.log(val));

