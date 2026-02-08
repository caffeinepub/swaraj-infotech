import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export type AttemptId = bigint;
export interface AnalyticsEvent {
    userId?: UserId;
    timestamp: bigint;
    details: string;
    eventType: string;
}
export interface PracticeProgress {
    totalAnswered: bigint;
    totalBookmarked: bigint;
    totalWrong: bigint;
}
export type QuestionId = bigint;
export interface OtpVerifyResult {
    token: string;
    isNew: boolean;
}
export interface Chapter {
    id: ChapterId;
    order: bigint;
    name: string;
    createdAt: bigint;
    course: string;
}
export type ChapterId = bigint;
export type UserId = bigint;
export interface BackupData {
    categories: Array<[bigint, Category]>;
    userAnswers: Array<[Principal, Array<UserAnswer>]>;
    notifications: Array<[bigint, Notification]>;
    nextAttemptId: AttemptId;
    phoneToUserId: Array<[string, UserId]>;
    nextCategoryId: CategoryId;
    nextChapterId: ChapterId;
    chapters: Array<[bigint, Chapter]>;
    questions: Array<[bigint, Question]>;
    userExamResults: Array<[UserId, Array<ExamResult>]>;
    nextNotificationId: NotificationId;
    callerToUserId: Array<[Principal, UserId]>;
    userBookmarks: Array<[Principal, Array<bigint>]>;
    profiles: Array<[Principal, UserProfile]>;
    nextUserId: UserId;
}
export interface UserAnswer {
    id: bigint;
    correct: boolean;
    timestamp: bigint;
    questionId: QuestionId;
    selectedOption: string;
}
export type NotificationId = bigint;
export interface Notification {
    id: NotificationId;
    title: string;
    createdAt: bigint;
    createdBy: Principal;
    message: string;
    targetSegment: string;
}
export interface ExamQuestionReview {
    question: Question;
    userCorrect: boolean;
    correct: boolean;
    originalAnswer?: string;
    selectedOption?: string;
}
export type CategoryId = bigint;
export interface ExamResult {
    questionReviews: Array<ExamQuestionReview>;
    attemptId: AttemptId;
    submitted: boolean;
    userId: UserId;
    answers: Array<UserAnswer>;
    score: bigint;
    timeRemaining: bigint;
    examType: string;
    passed: boolean;
}
export interface Question {
    id: QuestionId;
    question: string;
    hint: string;
    difficulty: Difficulty;
    explanation: string;
    createdAt: bigint;
    answer: string;
    course: string;
    chapter: string;
    optionA: string;
    optionB: string;
    optionC: string;
    optionD: string;
}
export interface UserProfile {
    userId: UserId;
    name: string;
    createdAt: bigint;
    phone: string;
    course: string;
}
export interface Category {
    id: CategoryId;
    name: string;
    createdAt: bigint;
    description: string;
}
export enum Difficulty {
    easy = "easy",
    hard = "hard",
    medium = "medium"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addAnalyticsEvent(eventType: string, userId: UserId | null, details: string): Promise<void>;
    addQuestion(course: string, chapter: string, difficulty: Difficulty, questionText: string, optionA: string, optionB: string, optionC: string, optionD: string, answer: string, hint: string, explanation: string): Promise<bigint>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    backupData(): Promise<BackupData>;
    bulkUploadQuestions(questionsData: Array<Question>): Promise<bigint>;
    createCategory(name: string, description: string): Promise<CategoryId>;
    createChapter(course: string, name: string, order: bigint): Promise<bigint>;
    createNotification(title: string, message: string, targetSegment: string): Promise<bigint>;
    deleteCategory(id: CategoryId): Promise<void>;
    deleteChapter(id: bigint): Promise<void>;
    deleteQuestion(id: bigint): Promise<void>;
    exportUserResults(): Promise<Array<[UserId, Array<ExamResult>]>>;
    getAnalyticsEvents(): Promise<Array<AnalyticsEvent>>;
    getAttempts(): Promise<Array<ExamResult>>;
    getBookmarkedQuestions(): Promise<Array<Question>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getExamModeReview(): Promise<{
        examHistory: Array<ExamResult>;
    }>;
    getExamQuestion(attemptId: bigint, questionId: bigint): Promise<ExamQuestionReview>;
    getNotifications(): Promise<Array<Notification>>;
    getPracticeProgress(course: string, chapter: string): Promise<PracticeProgress>;
    getQuestions(course: string | null, chapter: string | null, limit: bigint | null, offset: bigint | null): Promise<Array<Question>>;
    getUserExamHistory(userId: UserId): Promise<Array<ExamResult>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    listCategories(): Promise<Array<Category>>;
    listChapters(course: string | null): Promise<Array<Chapter>>;
    listNotifications(): Promise<Array<Notification>>;
    listUsers(): Promise<Array<[Principal, UserProfile]>>;
    restoreData(backup: BackupData): Promise<void>;
    saveCallerUserProfile(profile: {
        name: string;
        phone: string;
        course: string;
    }): Promise<void>;
    searchQuestions(course: string | null, chapter: string | null, difficulty: Difficulty | null, limit: bigint | null, offset: bigint | null): Promise<Array<Question>>;
    sendOtp(arg0: string): Promise<void>;
    startExam(course: string): Promise<bigint>;
    submitAnswer(questionId: bigint, selectedOption: string): Promise<boolean>;
    submitExam(attemptId: bigint, answers: Array<UserAnswer>): Promise<ExamResult>;
    toggleBookmark(questionId: bigint): Promise<void>;
    updateCategory(id: CategoryId, name: string, description: string): Promise<void>;
    updateChapter(id: bigint, course: string, name: string, order: bigint): Promise<void>;
    updateQuestion(id: bigint, course: string, chapter: string, difficulty: Difficulty, questionText: string, optionA: string, optionB: string, optionC: string, optionD: string, answer: string, hint: string, explanation: string): Promise<void>;
    verifyOtp(phoneNumber: string, arg1: string): Promise<OtpVerifyResult>;
}
