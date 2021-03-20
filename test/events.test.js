const { newEvent, getEvents } = require('../src/models/EventsModel');
// const Connection = require('../src/db/mysql')

test('Add a new event', async () => {
    await newEvent(1, '2021-01-16 09:02:26', 'rackety', 'some stuff')
    
    expect(
        await getEvents((result) => {
            for(i = 0; i < results.length; i++){
                if(result[i].event_title == 'rackety'){
                    return 0;
                }
            }
        })
    ).toBe(0);
});