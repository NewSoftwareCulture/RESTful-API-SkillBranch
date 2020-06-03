import Promise from 'bluebird';

export default async(items) => {
    let lastDate = 0;
    await Promise.each(items, element => {
        if (element.updatedAt > lastDate) lastDate = element.updatedAt;
    });
    return new Date(lastDate).toISOString();
};