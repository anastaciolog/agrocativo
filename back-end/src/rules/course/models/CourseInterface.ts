export interface CourseInterface {
    id: string
    teacher_id: string
    name: string
    duration: number
    description: string
    image: string
    active: boolean
    module: ModuleInterface[]
}

export interface ModuleInterface {
    id: string
    course_id: string
    name: string
    classroom: ClassroomInterface[]
}

export interface ClassroomInterface {
    id: string
    name: string
    intro: {
        description: string
        media: MediaInterface[]
    }
    new_content: {
        description: string
        task: Array<{ description: string, media: MediaInterface[] }>
    }
    library: {
        description: string
        media: MediaInterface[]
    }
    lesson: {
        description: string
        tasks: TaskInterface[]
    }
}

export interface DiscussionInterface {
    id: string
    description: string
    items: Array<{ description: string, comments: CommentInterface[] }>
}

export interface LessonOptionInterface {
    id: string
    lesson_id: string
    description: string
    correct: boolean
}

export interface CommentInterface {
    id: string
    user_id: string
    content: string
    upvote: string[]
    downvote: string[]
}

export interface MediaInterface {
    id: string
    profile: string[]
    src: string
    type: string
    name: string
    description: string
}

export interface TaskInterface {
    id: string
    description: string
    options: LessonOptionInterface[]
}