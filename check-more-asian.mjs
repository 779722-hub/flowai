import https from 'https';

const candidates = [
    '1530630842107-06cafb0a2b7a',
    '1607746882042-944635dfe10e',
    '1485216088717-e2d33373f35c',
    '1504593811423-6dd665756598',
    '1595152772835-219674b2a8a6',
    '1614283233556-f35b0c801ef1',
    '1567453795087-d08db2cbd8c8',
    '1596496050827-8299e0220de1',
    '1536321115970-5dfa13356a45',
    '1580894894513-541e068a3e2b',
    '1578530126283-aa45b62dde57',
    '1560250097-0b93528c311a',
    '1553267751-1c148a7280a1',
    '1554151228-14d9def656e4',
    '1601814933824-fd0b574dd592',
    '1551836022-d5d88e9218df',
    '1519085360753-af0119f7cbe7',
    '1521310192545-4ac7951413f0',
    '1524504388940-b1c1722653e1',
    '1552519507-da3b142c6e3d',
];

function check(id) {
    return new Promise((resolve) => {
        const url = `https://images.unsplash.com/photo-${id}?w=100&h=100&fit=crop&crop=faces&q=60`;
        https.get(url, (res) => { resolve(res.statusCode); res.resume(); })
             .on('error', () => resolve('err'));
    });
}
for (const id of candidates) {
    const status = await check(id);
    console.log(status === 200 ? 'OK ' : 'BAD', status, id);
}
