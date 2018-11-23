const Rx = require('rxjs')
const {
    map,
    switchMap
} = require('rxjs/operators')

function getPhone(userId, callback) {
    setTimeout(() => {
        return callback(null, {
            ddd: 11,
            phone: 112123123
        })
    }, 1000);
}

function getAddress(userId, callback) {
    setTimeout(() => {
        return callback(null, {
            street: 'rua dos bobos',
            number: 0
        })
    }, 1000);
}

function getUser(username, callback) {
    setTimeout(() => {
        return callback(null, {
            id: 1,
            username: username || '@erickwendel_'
        })
    }, 1000);
}

(function main() {

    const getAddressObs = Rx.bindNodeCallback(getAddress)
    const getPhoneObs = Rx.bindNodeCallback(getPhone)
    const getUserObs = Rx.bindNodeCallback(getUser)
    const concatObj = (item) => map(i => Object.assign({}, i, item))

    const stdin = process.openStdin()
    console.log('Digite um nome para pesquisar um usuario')
    Rx.fromEvent(stdin, 'data')
        .pipe(switchMap(data => getUserObs(data.toString().trim())))
        .pipe(
            switchMap(user =>
                getAddressObs(user.id)
                .pipe(concatObj(user))
            )
        )
        .pipe(
            switchMap(user =>
                getPhoneObs(user.id)
                .pipe(concatObj(user))
            )
        )
        .pipe(
            map(item => `
            User: ${item.username} 
            Address: ${item.street}, ${item.number} 
            Phone: (${item.ddd}) ${item.phone}
            `)
        )
        .subscribe(console.log)

})()