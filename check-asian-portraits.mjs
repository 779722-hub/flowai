import https from 'https';

const candidates = [
    { tag: 'asian-m', id: '1521119989659-a83eee488004' },
    { tag: 'asian-m', id: '1557862921-37829c790f19' },
    { tag: 'asian-m', id: '1539701938214-0d9736e1c16b' },
    { tag: 'asian-m', id: '1573497019940-1c28c88b4f3e' },
    { tag: 'asian-m', id: '1544005313-94ddf0286df2' },
    { tag: 'asian-m', id: '1615813967515-e1838c1c5116' },
    { tag: 'asian-m', id: '1600486913747-55e5470d6f40' },
    { tag: 'asian-m', id: '1558898479-33c0057a5d12' },
    { tag: 'asian-m', id: '1567515004624-219c11d31f2e' },
    { tag: 'asian-m', id: '1578932750294-f5075e85f44a' },
    { tag: 'asian-m', id: '1543610892606-2e9e0ea66a62' },
    { tag: 'asian-m', id: '1506277886164-e25aa3f4ef7f' },
    { tag: 'asian-f', id: '1488426862026-3ee34a7d66df' },
    { tag: 'asian-f', id: '1605405748313-a416a1b84491' },
    { tag: 'asian-f', id: '1519699047748-de8e457a634e' },
    { tag: 'asian-f', id: '1541288097308-7b8e3f58c4c6' },
    { tag: 'asian-f', id: '1592621385612-4d7129426394' },
    { tag: 'asian-f', id: '1513956589380-bad6acb9b9d4' },
    { tag: 'asian-f', id: '1598641795816-a84ac9eb59fe' },
    { tag: 'asian-f', id: '1489533119213-66a5cd877091' },
    { tag: 'asian-f', id: '1573497491208-6b1acb260507' },
    { tag: 'asian-f', id: '1531123414780-f74242c2b052' },
];

function check(id) {
    return new Promise((resolve) => {
        const url = `https://images.unsplash.com/photo-${id}?w=100&h=100&fit=crop&crop=faces&q=60`;
        https.get(url, (res) => { resolve(res.statusCode); res.resume(); })
             .on('error', () => resolve('err'));
    });
}
for (const c of candidates) {
    const status = await check(c.id);
    console.log(status === 200 ? 'OK ' : 'BAD', status, c.tag, c.id);
}
