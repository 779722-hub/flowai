// Verify candidate Unsplash IDs for 5 broken slots.
const candidates = {
    'grant-na-cifrovizaciyu-biznesa-rk.html (error analysis / documents)': [
        '1554224155-6726b3ff858f', // docs on desk
        '1450101499163-c8848e66ad76', // broken original — skip
        '1600267165477-6d4cc741b379', // tablet + docs
        '1553877522-43269d4ea984', // business meeting docs
        '1581094794329-c8112a89af12', // laptop analysis
        '1554224154-26032ffc0d07',
        '1664575601786-b00156752b61', // documents
        '1512758017271-d7b84c2113f1',
    ],
    'ii-v-hr-neyroset-otbor-kandidatov.html (video call / interview)': [
        '1600880292089-90a7e086ee0c', // video conf
        '1588196749597-9ff075ee6b5b',
        '1560250097-0b93528c311a', // interview
        '1573496359142-b8d87734a5a2',
        '1573497019940-1c28c88b4f3e',
        '1560250097-0b93528c311a',
        '1588196749597-9ff075ee6b5b',
        '1584433144697-8d21b2d32c6a',
    ],
    'nalogi-ii-avtomatizaciya-otchetnosti-ip.html (entrepreneur docs + laptop)': [
        '1554224155-6726b3ff858f',
        '1554224154-26032ffc0d07',
        '1554224154-22dec7ec8818',
        '1556761175-b413da4baf72', // laptop + docs
        '1606857521015-7f9fcf423740', // accounting
        '1586486855514-8c633cc6fd29',
        '1664575601786-b00156752b61',
    ],
    'pochemu-biznes-vybiraet-telegram-vitrina.html + trendy-avtomatizacii-kazahstan-2026.html (AI messenger)': [
        '1611746872915-64382b5c76da', // phone chat bubbles
        '1577563908411-5077b6dc7624',
        '1611746872915-64382b5c76da',
        '1515378960530-7c0da6231fb1', // messaging
        '1556761175-4b46a572b786',
        '1563986768494-4dee2763ff3f',
        '1611746872915-64382b5c76da',
        '1516321318423-f06f85e504b3',
    ],
    'uchet-stroymaterialov-gazoblok-kirpich-ii.html (construction blocks yard)': [
        '1503387762-bf4d84e2baf1', // bricks
        '1503387837-b154d5074bd2', // construction site
        '1503380842-ca75ce7c57e6',
        '1582138825658-e26a3ab9b45e', // warehouse
        '1621905251189-08b45d6a269e',
        '1504307651254-35680f356dfd',
        '1590644365607-1c5e1e5bbf68', // broken original
        '1505816014357-96b5ff457e9a', // construction
    ],
};

async function probe(id) {
    const url = `https://images.unsplash.com/photo-${id}?w=200&h=200&fit=crop`;
    try {
        const res = await fetch(url, { method: 'HEAD', redirect: 'follow' });
        return res.status;
    } catch (e) {
        return 'ERR';
    }
}

for (const [slot, ids] of Object.entries(candidates)) {
    console.log(`\n== ${slot}`);
    const results = await Promise.all(ids.map(async id => [id, await probe(id)]));
    for (const [id, st] of results) {
        console.log(`  ${st}  photo-${id}`);
    }
}
