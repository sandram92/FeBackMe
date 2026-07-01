// Generics

type User = {
    name: "string"

}

type CreateUser<T> = (name: T, age: number) => number

const createUser: CreateUser<number> = (name, age) => {


    return age
}

createUser(5, 6)

const createAnotherUser: CreateUser<string> = (name, age) => {


    return age
}


createAnotherUser("ddd", 6)

// Unions

function testingUnion(id: string | number): number | string {

    return id
}


/// Optional parameters ???

// Arrays

type AverageScore = (ratings: number[]) => number

const calculateAvergar: AverageScore = (ratings) => {

    return ratings.reduce((rating, num) => {
        return rating + num
    }, 0) / ratings.length
}

export function averageScore(ratings: number[]): number {
    return ratings.reduce((rating, num) => {
        return rating + num
    }, 0) / ratings.length

}


// Object Literral Types - we can also have optional property


type Mail<T> = {
    from: string;
    to: T;
    urgent: boolean;
}

function sendingMail(mail: Mail<number>) {

    return `Urgent ${mail.urgent}`

}

sendingMail({
    from: "Sandra",
    to: 5,
    urgent: true
})

// Discriminant Unions

type MultipleChoiceLesson = {
    kind: "multi"
    text: string
    another: number
}

type Geography<T> = {
    kind: "geograp"
    map: string
    test: T
    exist: boolean
}

type Lesson = MultipleChoiceLesson | Geography<string>


function isCorrect(lesson: Lesson): boolean | number {
    switch (lesson.kind) {
        case "geograp":
            return lesson.exist
        case "multi":
            return lesson.another

    }
}

isCorrect({
    kind: "geograp",
    map: "ddd",
    test: "fff",
    exist: true
})

// Dynamic key

