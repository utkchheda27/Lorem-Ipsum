export const getDateAndTime = () => {
    const date = new Date;
    const dateN = `${date.getDate()}|${date.getMonth()}|${date.getFullYear()}`
    const time = `${date.getHours()}:${date.getMinutes()}`
    return { date: dateN, time }
}