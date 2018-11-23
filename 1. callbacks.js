function getPhone(userId, callback) {
    setTimeout(() => {
        return callback(null, {
            ddd: 11,
            number: 112123123
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
            username: '@erickwendel_'
        })
    }, 1000);
}

(function main() {
    const stdin = process.openStdin()
    console.log('Digite um nome para pesquisar um usuario')
    stdin.on('data', (data) => {
        const username = data.toString().trim()
        console.log(`Pesquisando por ${username}... `)
        getUser(username, function resolveUser(error1, user) {
            getAddress(user.id, function resolveAddress(error2, address) {
                getPhone(user.id, function resolvePhone(error3, phone) {
                    console.log(
                            `
                            User: ${user.username},
                            Address: ${address.street}, ${address.number},
                            Phone: (${phone.ddd}) ${phone.number}
                            `)
                })
            })
        })
    })
})()