import https from 'https';

const candidates = [
    // Kazakh-looking (Asian light-skinned)
    { tag: 'kz-m', id: '1612349317150-e413f6a5b16d' },
    { tag: 'kz-m', id: '1542909168-82c3e7fdca5c' },
    { tag: 'kz-m', id: '1531384441138-2736e62e0919' },
    { tag: 'kz-m', id: '1552058544-f2b08422138a' },
    { tag: 'kz-m', id: '1546961342-b7ea5c16f9cf' },
    { tag: 'kz-m', id: '1578496781985-452d4a934d50' },
    { tag: 'kz-m', id: '1556474835-b0f3ac40d4d1' },
    { tag: 'kz-m', id: '1519085360753-af0119f7cbe7' },
    { tag: 'kz-f', id: '1569913486515-b74bf7751574' },
    { tag: 'kz-f', id: '1508214751196-bcfd4ca60f91' },
    { tag: 'kz-f', id: '1542379653-b204e721b30f' },
    { tag: 'kz-f', id: '1545996124-0501ebae84d0' },
    { tag: 'kz-f', id: '1604426633861-11b2faead63c' },
    { tag: 'kz-f', id: '1534528741775-53994a69daeb' },
    { tag: 'kz-f', id: '1531123897727-8f129e1688ce' },
    { tag: 'kz-f', id: '1500917293891-ef795e70e1f6' },
    // Russian-looking (European light-skinned)
    { tag: 'ru-m', id: '1507003211169-0a1dd7228f2d' },
    { tag: 'ru-m', id: '1568602471122-7832951cc4c5' },
    { tag: 'ru-m', id: '1539571696357-5a69c17a67c6' },
    { tag: 'ru-m', id: '1472099645785-5658abf4ff4e' },
    { tag: 'ru-m', id: '1517841905240-472988babdf9' },
    { tag: 'ru-m', id: '1506794778202-cad84cf45f1d' },
    { tag: 'ru-f', id: '1494790108755-2616b1c6b6a5' },
    { tag: 'ru-f', id: '1544005313-94ddf0286df2' },
    { tag: 'ru-f', id: '1531746020798-e6953c6e8e04' },
    { tag: 'ru-f', id: '1438761681033-6461ffad8d80' },
    { tag: 'ru-f', id: '1487412720507-e7ab37603c6f' },
    { tag: 'ru-f', id: '1554727242-741c14fa561c' },
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
