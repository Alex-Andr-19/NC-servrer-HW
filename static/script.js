function logging(msg, _flag='log') {
    let p = document.createElement('p')
    p.classList.add('logSpan')
    if (_flag === 'er') {
        p.classList.add('er')
    }
    p.innerText = _flag.toUpperCase() + ": " + msg
    document.getElementById('errorBlock').append(p)
}

function creatInputField(lastNum) {
    let row = document.createElement('tr');
    row.id = 'lastRow'

    let td = document.createElement('td');
    td.innerText = lastNum + 1;
    row.append(td);

    for (let i = 0; i < 3; i++) {
        td = document.createElement('td');
        let input = document.createElement('input');
        input.type = 'text';

        if (i === 0) input.placeholder = 'Name';
        if (i === 1) input.placeholder = 'E-mail';
        if (i === 2) input.placeholder = 'Phone Number';

        td.append(input);
        row.append(td);
    }

    return row;
}

function genUsersTable(data) {
    let table = document.getElementById('usersTable');
    table.innerHTML = '<tr class="firstLine">\n' +
        '            <th>ID</th>\n' +
        '            <th>Name</th>\n' +
        '            <th>E-mail</th>\n' +
        '            <th>Phone number</th>\n' +
        '        </tr>'
    let lastNum;

    data.forEach(user => {
        let row = document.createElement('tr');

        for (let prop in user) {
            let td = document.createElement('td')
            td.innerText = user[prop]
            row.append(td)
        }

        table.append(row)
        lastNum = user.id
    })

    table.append(creatInputField(lastNum))

    console.log(data)
}

function printInTextarea(data) {
    let textarea = document.getElementById('usersJson')

    textarea.innerText = JSON.stringify(data)
}

function getUsersObj() {
    getAllUsers(printInTextarea)
}

function getAllUsers(func) {
    fetch('/users')
        .then(response => response.json())
        .then(json => {
            func(json)
        });
}

function addUser() {
    let lastRow = document.getElementById('lastRow').children;
    let postData = [];
    let correct = 0;
    for (let i = 1; i < lastRow.length; i++) {
        postData.push(lastRow[i].children[0].value);
        if (postData[i - 1]) correct = 1
    }

    if (correct)
        fetch('/addUser', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify(postData)})
            .then(response => response.json())
            .then(json => {
                console.log(json)
                if (json.success) getAllUsers(genUsersTable);
                logging(json.msg)
            });
    else logging('One of fields must be defined', 'er')

}

function delUser() {
    let userId = document.getElementById('delUserNum').value

    if (userId)
        fetch('/delUser', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify({ id: userId })})
            .then(response => response.json())
            .then(json => {
                console.log(json)
                if (json.success) getAllUsers(genUsersTable);
                logging(json.msg)
            });
    else logging('ID is not defined', 'er')
}

window.addEventListener('load', () => getAllUsers(genUsersTable));
