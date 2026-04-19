import https from 'https';

const urls = [
    { name: 'Интернет-магазины (курьер)',    id: '1586769852836-bc069f19e1b6' },
    { name: 'Гостиницы и SPA (озеро)',        id: '1439130490301-25e322d88054' },
    { name: 'Клиники (доктор телефон)',       id: '1612531386530-97286d97c2d2' },
    { name: 'Онлайн-школы (гитара комп)',     id: '1510915361894-db8b60106cb1' },
    { name: 'Автосалоны (костюм авто)',       id: '1560253023-3ec5d502959f' },
    { name: 'Недвижимость (коттеджи)',        id: '1600585154340-be6161a56a0c' },
    { name: 'HoReCa (коробки еда)',           id: '1578916171728-46686eac8d58' },
    { name: 'Красота (ногти салон)',          id: '1604654894610-df63bc536371' },
    { name: 'Фитнес (тренер качалка)',        id: '1581009146145-b5ef050c2e1e' },
];

function check(id) {
    return new Promise((resolve) => {
        const url = `https://images.unsplash.com/photo-${id}?w=400&h=400&fit=crop&q=70`;
        https.get(url, (res) => {
            resolve({ id, status: res.statusCode });
            res.resume();
        }).on('error', () => resolve({ id, status: 'err' }));
    });
}

for (const u of urls) {
    const r = await check(u.id);
    console.log(r.status === 200 ? 'OK ' : 'BAD', r.status, '—', u.name);
}
