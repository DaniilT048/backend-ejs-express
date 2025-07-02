export const users = [];

export function addUser(username, password) {
    users.push({ username, password });
}

export function findUser(username, password) {
    return users.find(u => u.username === username && u.password === password);
}