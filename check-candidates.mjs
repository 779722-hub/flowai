import https from 'https';

// Candidates to verify
const candidates = [
    // Courier delivery to girl
    { tag: 'courier-girl', id: '1577741314755-048d8525d31e' },
    { tag: 'courier-girl', id: '1517646287270-a5a9ca602e5c' },
    { tag: 'courier-girl', id: '1530653333484-7d26e9ff05db' },
    { tag: 'courier-girl', id: '1556742049-0cfed4f6a45d' },
    { tag: 'courier-girl', id: '1607082348824-0a96f2a4b9da' },
    { tag: 'courier-girl', id: '1615861476648-b5e3ec92b6bd' },
    { tag: 'courier-girl', id: '1586528116022-aeda1700e5b6' },
    { tag: 'courier-girl', id: '1634224580942-c7c3f8d3f1ad' },
    // Doctor with phone/hospital
    { tag: 'doctor-phone', id: '1584982751601-97dcc096659c' },
    { tag: 'doctor-phone', id: '1666214280557-f1b5022eb634' },
    { tag: 'doctor-phone', id: '1579684385127-1ef15d508118' },
    { tag: 'doctor-phone', id: '1631217868264-e5b90bb7e133' },
    { tag: 'doctor-phone', id: '1559757148-5c350d0d3c56' },
    // Guitar + computer (boy online)
    { tag: 'guitar-comp',  id: '1517457373958-b7bdd4587205' },
    { tag: 'guitar-comp',  id: '1598387181032-a3103a2db5b3' },
    { tag: 'guitar-comp',  id: '1564186763535-ebb21ef5277f' },
    // Suit man at cars
    { tag: 'suit-cars',    id: '1567449303183-ae0d6ed1498e' },
    { tag: 'suit-cars',    id: '1621939514649-280e2ee25f60' },
    // Food boxes
    { tag: 'food-boxes',   id: '1566740933430-b5e70b06d2d5' },
    { tag: 'food-boxes',   id: '1542838132-92c53300491e' },
    { tag: 'food-boxes',   id: '1607083206869-4c7672e72a8a' },
    // Cottages row
    { tag: 'cottages',     id: '1542718610-a1d656d1884c' },
    { tag: 'cottages',     id: '1564013799919-ab600027ffc6' },
    { tag: 'cottages',     id: '1512917774080-9991f1c4c750' },
    // Lake hotel
    { tag: 'lake-hotel',   id: '1501785888041-af3ef285b470' },
    { tag: 'lake-hotel',   id: '1540541338287-41700207dee6' },
    { tag: 'lake-hotel',   id: '1566073771259-6a8506099945' },
    // Nail salon, two girls
    { tag: 'nails-salon',  id: '1604654894610-df63bc536371' },
    { tag: 'nails-salon',  id: '1610992015732-2449b76344bc' },
    { tag: 'nails-salon',  id: '1519415943484-9fa1873496d4' },
    { tag: 'nails-salon',  id: '1632345031435-8727f6897d53' },
    // Buff trainer
    { tag: 'buff-trainer', id: '1581009146145-b5ef050c2e1e' },
    { tag: 'buff-trainer', id: '1599058917212-d750089bc07e' },
    { tag: 'buff-trainer', id: '1534438327276-14e5300c3a48' },
    { tag: 'buff-trainer', id: '1571019614242-c5c5dee9f50b' },
];

function check(id) {
    return new Promise((resolve) => {
        const url = `https://images.unsplash.com/photo-${id}?w=100&h=100&fit=crop&q=50`;
        https.get(url, (res) => { resolve(res.statusCode); res.resume(); })
             .on('error', () => resolve('err'));
    });
}

for (const c of candidates) {
    const status = await check(c.id);
    console.log(status === 200 ? 'OK ' : 'BAD', status, c.tag, '→', c.id);
}
