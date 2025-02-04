export interface ITask {
    "id": string,
    "taskName": string,
    "taskSort": number,
    "dueTo": string,
    "isCompleted": boolean,
    "isArchived": boolean,
    "todoCategoryId": string,
    "todoPriorityId": string,
    "syncDt": string
}