export function getMessageCups(totalPoints: number): string {
    let message = `☕️На данный момент выпито ${totalPoints} `;

    if (totalPoints % 10 === 0 || (totalPoints % 10 >= 5 && totalPoints % 10 <= 9 )) {
        message += `чашек`;
    } else {
        message += `чашки`;
    }

    message += ` кофе☕️`

    return message;
}