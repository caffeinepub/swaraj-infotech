import List "mo:core/List";
import Map "mo:core/Map";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import Time "mo:core/Time";
import Text "mo:core/Text";
import Nat "mo:core/Nat";
import Int "mo:core/Int";
import Array "mo:core/Array";
import Iter "mo:core/Iter";
import Random "mo:core/Random";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

(actor {
  module DataModel {
    public type UserId = Nat;
    public type QuestionId = Nat;
    public type AttemptId = Nat;
    public type ChapterId = Nat;
    public type CategoryId = Nat;
    public type NotificationId = Nat;

    public type Difficulty = {
      #easy;
      #medium;
      #hard;
    };

    public type AttemptStatus = {
      #started;
      #inProgress;
      #submitted;
      #finished;
    };

    public type Question = {
      id : QuestionId;
      course : Text;
      chapter : Text;
      difficulty : Difficulty;
      question : Text;
      optionA : Text;
      optionB : Text;
      optionC : Text;
      optionD : Text;
      answer : Text;
      hint : Text;
      explanation : Text;
      createdAt : Int;
    };

    public type UserProfile = {
      userId : UserId;
      name : Text;
      phone : Text;
      course : Text;
      createdAt : Int;
    };

    public type OtpVerifyResult = {
      token : Text;
      isNew : Bool;
    };

    public type ExamQuestionReview = {
      question : Question;
      selectedOption : ?Text;
      correct : Bool;
      userCorrect : Bool;
      originalAnswer : ?Text;
    };

    public type ExamResult = {
      attemptId : AttemptId;
      userId : UserId;
      score : Int;
      timeRemaining : Int;
      submitted : Bool;
      passed : Bool;
      examType : Text;
      answers : [UserAnswer];
      questionReviews : [ExamQuestionReview];
    };

    public type PracticeProgress = {
      totalAnswered : Nat;
      totalWrong : Nat;
      totalBookmarked : Nat;
    };

    public type ExamAttempt = {
      attemptId : AttemptId;
      userId : UserId;
      course : Text;
      questionIds : [QuestionId];
      startTime : Int;
      timeLimit : Int;
      submitted : Bool;
      answers : [UserAnswer];
    };

    public type UserAnswer = {
      id : Nat;
      questionId : QuestionId;
      selectedOption : Text;
      correct : Bool;
      timestamp : Int;
    };

    public type Chapter = {
      id : ChapterId;
      course : Text;
      name : Text;
      order : Nat;
      createdAt : Int;
    };

    public type Category = {
      id : CategoryId;
      name : Text;
      description : Text;
      createdAt : Int;
    };

    public type Notification = {
      id : NotificationId;
      title : Text;
      message : Text;
      targetSegment : Text;
      createdAt : Int;
      createdBy : Principal;
    };

    public type BackupData = {
      questions : [(Nat, Question)];
      chapters : [(Nat, Chapter)];
      categories : [(Nat, Category)];
      profiles : [(Principal, UserProfile)];
      userAnswers : [(Principal, [UserAnswer])];
      userBookmarks : [(Principal, [Nat])];
      userExamResults : [(UserId, [ExamResult])];
      notifications : [(Nat, Notification)];
      phoneToUserId : [(Text, UserId)];
      callerToUserId : [(Principal, UserId)];
      nextUserId : UserId;
      nextAttemptId : AttemptId;
      nextChapterId : ChapterId;
      nextCategoryId : CategoryId;
      nextNotificationId : NotificationId;
    };

    // Added for analytics first field iteration:
    public type AnalyticsEvent = {
      eventType : Text;
      timestamp : Int;
      userId : ?UserId;
      details : Text;
    };
  };

  public type UserId = DataModel.UserId;
  public type QuestionId = DataModel.QuestionId;
  public type AttemptId = DataModel.AttemptId;
  public type CategoryId = DataModel.CategoryId;
  public type Difficulty = DataModel.Difficulty;
  public type AttemptStatus = DataModel.AttemptStatus;
  public type UserProfile = DataModel.UserProfile;
  public type ExamQuestionReview = DataModel.ExamQuestionReview;
  public type ExamResult = DataModel.ExamResult;
  public type PracticeProgress = DataModel.PracticeProgress;
  public type ExamAttempt = DataModel.ExamAttempt;
  public type UserAnswer = DataModel.UserAnswer;
  public type Chapter = DataModel.Chapter;
  public type Category = DataModel.Category;
  public type Notification = DataModel.Notification;
  public type BackupData = DataModel.BackupData;
  public type OtpVerifyResult = DataModel.OtpVerifyResult;
  public type AnalyticsEvent = DataModel.AnalyticsEvent;

  let profiles = Map.empty<Principal, UserProfile>();
  let questions = Map.empty<Nat, DataModel.Question>();
  let userAnswers = Map.empty<Principal, List.List<UserAnswer>>();
  let userBookmarks = Map.empty<Principal, List.List<Nat>>();
  let userExamResults = Map.empty<UserId, List.List<ExamResult>>();
  let phoneToUserId = Map.empty<Text, UserId>();
  let callerToUserId = Map.empty<Principal, UserId>();
  let attempts = Map.empty<AttemptId, ExamAttempt>();
  let attemptOwners = Map.empty<AttemptId, Principal>();
  let chapters = Map.empty<Nat, Chapter>();
  let categories = Map.empty<CategoryId, Category>();
  let notifications = Map.empty<Nat, Notification>();
  let analyticsEvents = List.empty<AnalyticsEvent>(); // Store analytics events
  var nextUserId : Nat = 1;
  var nextAttemptId : Nat = 1;
  var nextChapterId : Nat = 1;
  var nextCategoryId : Nat = 1;
  var nextNotificationId : Nat = 1;
  let accessControlState = AccessControl.initState();

  include MixinAuthorization(accessControlState);

  public func sendOtp(_ : Text) : async () { () };

  public shared ({ caller }) func verifyOtp(phoneNumber : Text, _ : Text) : async DataModel.OtpVerifyResult {
    var userId : ?UserId = null;

    switch (phoneToUserId.get(phoneNumber)) {
      case (?id) {
        userId := ?id;
        if (userId != null) {
          callerToUserId.add(caller, id);
        };
      };
      case (null) {
        let newUserId = nextUserId;
        nextUserId += 1;
        userId := ?newUserId;
        phoneToUserId.add(phoneNumber, newUserId);
        callerToUserId.add(caller, newUserId);
        AccessControl.assignRole(accessControlState, caller, caller, #user);
      };
    };

    {
      token = caller.toText();
      isNew = true;
    };
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : { name : Text; phone : Text; course : Text }) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only authenticated users can save profiles");
    };

    let existingProfile = profiles.get(caller);

    switch (existingProfile) {
      case (null) {
        let userId = nextUserId;
        nextUserId += 1;
        let userProfile : UserProfile = {
          userId;
          name = profile.name;
          phone = profile.phone;
          course = profile.course;
          createdAt = Time.now();
        };

        profiles.add(caller, userProfile);
        phoneToUserId.add(profile.phone, userId);
        callerToUserId.add(caller, userId);
      };
      case (?existing) {
        let userProfile : UserProfile = {
          userId = existing.userId;
          name = profile.name;
          phone = profile.phone;
          course = profile.course;
          createdAt = existing.createdAt;
        };

        if (existing.phone != profile.phone) {
          phoneToUserId.remove(existing.phone);
          phoneToUserId.add(profile.phone, existing.userId);
        };

        profiles.add(caller, userProfile);
      };
    };
  };

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only authenticated users can view profiles");
    };
    profiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    profiles.get(user);
  };

  // Admin: Add Question
  public shared ({ caller }) func addQuestion(
    course : Text,
    chapter : Text,
    difficulty : DataModel.Difficulty,
    questionText : Text,
    optionA : Text,
    optionB : Text,
    optionC : Text,
    optionD : Text,
    answer : Text,
    hint : Text,
    explanation : Text,
  ) : async Nat {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Only admins can add questions");
    };

    let id = questions.size() + 1;

    let question : DataModel.Question = {
      id;
      course;
      chapter;
      difficulty;
      question = questionText;
      optionA;
      optionB;
      optionC;
      optionD;
      answer;
      hint;
      explanation;
      createdAt = Time.now();
    };

    questions.add(id, question);
    id;
  };

  // Admin: Update Question
  public shared ({ caller }) func updateQuestion(
    id : Nat,
    course : Text,
    chapter : Text,
    difficulty : DataModel.Difficulty,
    questionText : Text,
    optionA : Text,
    optionB : Text,
    optionC : Text,
    optionD : Text,
    answer : Text,
    hint : Text,
    explanation : Text,
  ) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Only admins can update questions");
    };

    let existing = questions.get(id);
    switch (existing) {
      case (null) { Runtime.trap("Question not found") };
      case (?q) {
        let updated : DataModel.Question = {
          id;
          course;
          chapter;
          difficulty;
          question = questionText;
          optionA;
          optionB;
          optionC;
          optionD;
          answer;
          hint;
          explanation;
          createdAt = q.createdAt;
        };
        questions.add(id, updated);
      };
    };
  };

  // Admin: Delete Question
  public shared ({ caller }) func deleteQuestion(id : Nat) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Only admins can delete questions");
    };

    questions.remove(id);
  };

  // Admin: Search/List Questions with filtering
  public query ({ caller }) func searchQuestions(
    course : ?Text,
    chapter : ?Text,
    difficulty : ?DataModel.Difficulty,
    limit : ?Nat,
    offset : ?Nat
  ) : async [DataModel.Question] {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Only admins can search questions");
    };

    var filteredQuestions = List.fromIter<DataModel.Question>(questions.values());

    switch (course) {
      case (?c) {
        filteredQuestions := filteredQuestions.filter(
          func(q) { Text.equal(q.course, c) }
        );
      };
      case (null) {};
    };

    switch (chapter) {
      case (?ch) {
        filteredQuestions := filteredQuestions.filter(
          func(q) { Text.equal(q.chapter, ch) }
        );
      };
      case (null) {};
    };

    switch (difficulty) {
      case (?d) {
        filteredQuestions := filteredQuestions.filter(
          func(q) { q.difficulty == d }
        );
      };
      case (null) {};
    };

    let size = filteredQuestions.size();
    let start = switch (offset) { case (?o) { o }; case (null) { 0 } };
    let end = switch (limit) { case (?l) { Int.min((start + l).toInt(), size) }; case (null) { size } };
    let result = List.empty<DataModel.Question>();

    var i = 0;
    let iter = filteredQuestions.values();
    while (i < size and i < end) {
      switch (iter.next()) {
        case (null) {};
        case (?q) {
          if (i >= start) {
            result.add(q);
          };
        };
      };
      i += 1;
    };

    result.toArray();
  };

  // Admin: Bulk upload questions (CSV import)
  public shared ({ caller }) func bulkUploadQuestions(questionsData : [DataModel.Question]) : async Nat {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Only admins can bulk upload questions");
    };

    var count = 0;
    for (q in questionsData.vals()) {
      let id = questions.size() + 1;
      let question : DataModel.Question = {
        id;
        course = q.course;
        chapter = q.chapter;
        difficulty = q.difficulty;
        question = q.question;
        optionA = q.optionA;
        optionB = q.optionB;
        optionC = q.optionC;
        optionD = q.optionD;
        answer = q.answer;
        hint = q.hint;
        explanation = q.explanation;
        createdAt = Time.now();
      };
      questions.add(id, question);
      count += 1;
    };
    count;
  };

  // Public: Get Questions (for learners) - Returns questions WITHOUT answers for non-authenticated users
  public query ({ caller }) func getQuestions(course : ?Text, chapter : ?Text, limit : ?Nat, offset : ?Nat) : async [DataModel.Question] {
    var filteredQuestions = List.fromIter<DataModel.Question>(questions.values());

    switch (course) {
      case (?c) {
        filteredQuestions := filteredQuestions.filter(
          func(q) { Text.equal(q.course, c) }
        );
      };
      case (null) {};
    };

    switch (chapter) {
      case (?ch) {
        filteredQuestions := filteredQuestions.filter(
          func(q) { Text.equal(q.chapter, ch) }
        );
      };
      case (null) {};
    };

    let size = filteredQuestions.size();
    let start = switch (offset) { case (?o) { o }; case (null) { 0 } };
    let end = switch (limit) { case (?l) { Int.min((start + l).toInt(), size) }; case (null) { size } };
    let result = List.empty<DataModel.Question>();

    var i = 0;
    let iter = filteredQuestions.values();
    while (i < size and i < end) {
      switch (iter.next()) {
        case (null) {};
        case (?q) {
          if (i >= start) {
            // For non-authenticated users (guests), hide the answer field
            if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
              let sanitizedQuestion : DataModel.Question = {
                id = q.id;
                course = q.course;
                chapter = q.chapter;
                difficulty = q.difficulty;
                question = q.question;
                optionA = q.optionA;
                optionB = q.optionB;
                optionC = q.optionC;
                optionD = q.optionD;
                answer = ""; // Hide answer from guests
                hint = q.hint;
                explanation = ""; // Hide explanation from guests
                createdAt = q.createdAt;
              };
              result.add(sanitizedQuestion);
            } else {
              result.add(q);
            };
          };
        };
      };
      i += 1;
    };

    result.toArray();
  };

  // Admin: Create Chapter
  public shared ({ caller }) func createChapter(course : Text, name : Text, order : Nat) : async Nat {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Only admins can create chapters");
    };

    let id = nextChapterId;
    nextChapterId += 1;

    let chapter : Chapter = {
      id;
      course;
      name;
      order;
      createdAt = Time.now();
    };

    chapters.add(id, chapter);
    id;
  };

  // Admin: Update Chapter
  public shared ({ caller }) func updateChapter(id : Nat, course : Text, name : Text, order : Nat) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Only admins can update chapters");
    };

    let existing = chapters.get(id);
    switch (existing) {
      case (null) { Runtime.trap("Chapter not found") };
      case (?ch) {
        let updated : Chapter = {
          id;
          course;
          name;
          order;
          createdAt = ch.createdAt;
        };
        chapters.add(id, updated);
      };
    };
  };

  // Admin: Delete Chapter
  public shared ({ caller }) func deleteChapter(id : Nat) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Only admins can delete chapters");
    };

    chapters.remove(id);
  };

  // Admin: List Chapters
  public query ({ caller }) func listChapters(course : ?Text) : async [Chapter] {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Only admins can list chapters");
    };

    var filtered = List.fromIter<Chapter>(chapters.values());

    switch (course) {
      case (?c) {
        filtered := filtered.filter(func(ch) { Text.equal(ch.course, c) });
      };
      case (null) {};
    };

    filtered.toArray();
  };

  // Admin: Create Category
  public shared ({ caller }) func createCategory(name : Text, description : Text) : async CategoryId {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Only admins can create categories");
    };

    let id = nextCategoryId;
    nextCategoryId += 1;

    let category : Category = {
      id;
      name;
      description;
      createdAt = Time.now();
    };

    categories.add(id, category);
    id;
  };

  // Admin: Update Category
  public shared ({ caller }) func updateCategory(id : CategoryId, name : Text, description : Text) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Only admins can update categories");
    };

    let existing = categories.get(id);
    switch (existing) {
      case (null) { Runtime.trap("Category not found") };
      case (?cat) {
        let updated : Category = {
          id;
          name;
          description;
          createdAt = cat.createdAt;
        };
        categories.add(id, updated);
      };
    };
  };

  // Admin: Delete Category
  public shared ({ caller }) func deleteCategory(id : CategoryId) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Only admins can delete categories");
    };

    categories.remove(id);
  };

  // Admin: List Categories
  public query ({ caller }) func listCategories() : async [Category] {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Only admins can list categories");
    };

    List.fromIter<Category>(categories.values()).toArray();
  };

  // Admin: List all users
  public query ({ caller }) func listUsers() : async [(Principal, UserProfile)] {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Only admins can list users");
    };

    List.fromIter<(Principal, UserProfile)>(profiles.entries()).toArray();
  };

  // Admin: Get user exam history
  public query ({ caller }) func getUserExamHistory(userId : UserId) : async [ExamResult] {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Only admins can view user exam history");
    };

    let results = switch (userExamResults.get(userId)) {
      case (null) { List.empty<ExamResult>() };
      case (?list) { list };
    };

    results.toArray();
  };

  // Admin: Export user results to CSV format (returns structured data)
  public query ({ caller }) func exportUserResults() : async [(UserId, [ExamResult])] {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Only admins can export user results");
    };

    List.fromIter<(UserId, List.List<ExamResult>)>(userExamResults.entries())
      .map<(UserId, List.List<ExamResult>), (UserId, [ExamResult])>(func((uid, list)) { (uid, list.toArray()) })
      .toArray();
  };

  // Admin: Create Notification
  public shared ({ caller }) func createNotification(title : Text, message : Text, targetSegment : Text) : async Nat {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Only admins can create notifications");
    };

    let id = nextNotificationId;
    nextNotificationId += 1;

    let notification : Notification = {
      id;
      title;
      message;
      targetSegment;
      createdAt = Time.now();
      createdBy = caller;
    };

    notifications.add(id, notification);
    id;
  };

  // Admin: List all notifications
  public query ({ caller }) func listNotifications() : async [Notification] {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Only admins can list notifications");
    };

    List.fromIter<Notification>(notifications.values()).toArray();
  };

  // User: Get notifications for current user
  public query ({ caller }) func getNotifications() : async [Notification] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only authenticated users can view notifications");
    };

    // Return all notifications (segment filtering can be done client-side or enhanced here)
    List.fromIter<Notification>(notifications.values()).toArray();
  };

  // Admin: Backup data
  public query ({ caller }) func backupData() : async BackupData {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Only admins can backup data");
    };

    {
      questions = List.fromIter<(Nat, DataModel.Question)>(questions.entries()).toArray();
      chapters = List.fromIter<(Nat, Chapter)>(chapters.entries()).toArray();
      categories = List.fromIter<(CategoryId, Category)>(categories.entries()).toArray();
      profiles = List.fromIter<(Principal, UserProfile)>(profiles.entries()).toArray();
      userAnswers = List.fromIter<(Principal, List.List<UserAnswer>)>(userAnswers.entries())
        .map<(Principal, List.List<UserAnswer>), (Principal, [UserAnswer])>(func((p, list)) { (p, list.toArray()) })
        .toArray();
      userBookmarks = List.fromIter<(Principal, List.List<Nat>)>(userBookmarks.entries())
        .map<(Principal, List.List<Nat>), (Principal, [Nat])>(func((p, list)) { (p, list.toArray()) })
        .toArray();
      userExamResults = List.fromIter<(UserId, List.List<ExamResult>)>(userExamResults.entries())
        .map<(UserId, List.List<ExamResult>), (UserId, [ExamResult])>(func((uid, list)) { (uid, list.toArray()) })
        .toArray();
      notifications = List.fromIter<(Nat, Notification)>(notifications.entries()).toArray();
      phoneToUserId = List.fromIter<(Text, UserId)>(phoneToUserId.entries()).toArray();
      callerToUserId = List.fromIter<(Principal, UserId)>(callerToUserId.entries()).toArray();
      nextUserId;
      nextAttemptId;
      nextChapterId;
      nextCategoryId;
      nextNotificationId;
    };
  };

  // Admin: Restore data
  public shared ({ caller }) func restoreData(backup : BackupData) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Only admins can restore data");
    };

    nextUserId := backup.nextUserId;
    nextAttemptId := backup.nextAttemptId;
    nextChapterId := backup.nextChapterId;
    nextCategoryId := backup.nextCategoryId;
    nextNotificationId := backup.nextNotificationId;

    // Clear existing data
    for ((k, _) in questions.entries()) { questions.remove(k) };
    for ((k, _) in chapters.entries()) { chapters.remove(k) };
    for ((k, _) in categories.entries()) { categories.remove(k) };
    for ((k, _) in profiles.entries()) { profiles.remove(k) };
    for ((k, _) in userAnswers.entries()) { userAnswers.remove(k) };
    for ((k, _) in userBookmarks.entries()) { userBookmarks.remove(k) };
    for ((k, _) in userExamResults.entries()) { userExamResults.remove(k) };
    for ((k, _) in notifications.entries()) { notifications.remove(k) };
    for ((k, _) in phoneToUserId.entries()) { phoneToUserId.remove(k) };
    for ((k, _) in callerToUserId.entries()) { callerToUserId.remove(k) };

    // Restore data
    for ((k, v) in backup.questions.vals()) { questions.add(k, v) };
    for ((k, v) in backup.chapters.vals()) { chapters.add(k, v) };
    for ((k, v) in backup.categories.vals()) { categories.add(k, v) };
    for ((k, v) in backup.profiles.vals()) { profiles.add(k, v) };
    for ((k, v) in backup.userAnswers.vals()) { userAnswers.add(k, List.fromIter<UserAnswer>(v.vals())) };
    for ((k, v) in backup.userBookmarks.vals()) { userBookmarks.add(k, List.fromIter<Nat>(v.vals())) };
    for ((k, v) in backup.userExamResults.vals()) { userExamResults.add(k, List.fromIter<ExamResult>(v.vals())) };
    for ((k, v) in backup.notifications.vals()) { notifications.add(k, v) };
    for ((k, v) in backup.phoneToUserId.vals()) { phoneToUserId.add(k, v) };
    for ((k, v) in backup.callerToUserId.vals()) { callerToUserId.add(k, v) };
  };

  // User: Submit Answer
  public shared ({ caller }) func submitAnswer(questionId : Nat, selectedOption : Text) : async Bool {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only authenticated users can submit answers");
    };

    let question = questions.get(questionId);

    switch (question) {
      case (null) { Runtime.trap("Question not found") };
      case (?q) {
        let correct = Text.equal(
          selectedOption.trimStart(#char ' ').trimEnd(#char ' ')
        , q.answer.trimStart(#char ' ').trimEnd(#char ' '));

        let answer : UserAnswer = {
          id = 0;
          questionId;
          selectedOption;
          correct;
          timestamp = Time.now();
        };

        let answers = switch (userAnswers.get(caller)) {
          case (null) { List.empty<UserAnswer>() };
          case (?a) { a };
        };

        answers.add(answer);
        userAnswers.add(caller, answers);

        correct;
      };
    };
  };

  // User: Get Practice Progress
  public query ({ caller }) func getPracticeProgress(course : Text, chapter : Text) : async PracticeProgress {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only authenticated users can view practice progress");
    };

    let answers = switch (userAnswers.get(caller)) {
      case (null) { List.empty<UserAnswer>() };
      case (?a) { a };
    };

    let totalAnswered = answers.filter(
      func(a) {
        let question = questions.get(a.questionId);
        switch (question) {
          case (null) { false };
          case (?q) {
            Text.equal(q.course, course) and Text.equal(q.chapter, chapter);
          };
        };
      }
    ).size();

    let totalWrong = answers.filter(
      func(a) {
        let question = questions.get(a.questionId);
        switch (question) {
          case (null) { false };
          case (?q) {
            Text.equal(q.course, course) and Text.equal(q.chapter, chapter) and not a.correct;
          };
        };
      }
    ).size();

    let bookmarks = switch (userBookmarks.get(caller)) {
      case (null) { List.empty<Nat>() };
      case (?b) { b };
    };

    let totalBookmarked = bookmarks.filter(
      func(qid) {
        switch (questions.get(qid)) {
          case (null) { false };
          case (?q) {
            Text.equal(q.course, course) and Text.equal(q.chapter, chapter);
          };
        };
      }
    ).size();

    {
      totalAnswered;
      totalWrong;
      totalBookmarked;
    };
  };

  // User: Toggle Bookmark
  public shared ({ caller }) func toggleBookmark(questionId : Nat) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only authenticated users can toggle bookmarks");
    };

    let bookmarks = switch (userBookmarks.get(caller)) {
      case (null) { List.empty<Nat>() };
      case (?b) { b };
    };

    if (bookmarks.contains(questionId)) {
      let filtered = bookmarks.filter(func(qid) { qid != questionId });
      userBookmarks.add(caller, filtered);
    } else {
      bookmarks.add(questionId);
      userBookmarks.add(caller, bookmarks);
    };
  };

  // User: Get Bookmarked Questions
  public query ({ caller }) func getBookmarkedQuestions() : async [DataModel.Question] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only authenticated users can view bookmarked questions");
    };

    let bookmarks = switch (userBookmarks.get(caller)) {
      case (null) { List.empty<Nat>() };
      case (?b) { b };
    };

    let questionsArray = bookmarks.toArray();
    let result = List.empty<DataModel.Question>();

    let len = questionsArray.size();
    var i = 0;

    while (i < len) {
      let qid = questionsArray[i];
      switch (questions.get(qid)) {
        case (null) {};
        case (?q) { result.add(q) };
      };
      i += 1;
    };

    result.toArray();
  };

  // User: Start Exam
  public shared ({ caller }) func startExam(course : Text) : async Nat {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only authenticated users can start exams");
    };

    let userId = switch (callerToUserId.get(caller)) {
      case (null) { Runtime.trap("User ID not found") };
      case (?id) { id };
    };

    let (questionCount, timeLimit) = if (Text.equal(course, "MSCIT")) {
      (15, 15 * 60);
    } else if (Text.equal(course, "GCC-TBC")) {
      (25, 25 * 60);
    } else {
      Runtime.trap("Invalid course");
    };

    let courseQuestions = List.fromIter<DataModel.Question>(questions.values()).filter(
      func(q) { Text.equal(q.course, course) }
    );

    if (courseQuestions.size() < questionCount) {
      Runtime.trap("Not enough questions available for this course");
    };

    let shuffled = Array.tabulate(courseQuestions.size(), func(i) {
      courseQuestions.toArray()[i];
    });

    let selectedQuestions = Array.tabulate(questionCount, func(i) {
      shuffled[i].id;
    });

    let attemptId = nextAttemptId;
    nextAttemptId += 1;

    let attempt : ExamAttempt = {
      attemptId;
      userId;
      course;
      questionIds = selectedQuestions;
      startTime = Time.now();
      timeLimit;
      submitted = false;
      answers = [];
    };

    attempts.add(attemptId, attempt);
    attemptOwners.add(attemptId, caller);

    attemptId;
  };

  // User: Get Exam Question
  public query ({ caller }) func getExamQuestion(attemptId : Nat, questionId : Nat) : async ExamQuestionReview {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only authenticated users can view exam questions");
    };

    let owner = switch (attemptOwners.get(attemptId)) {
      case (null) { Runtime.trap("Attempt not found") };
      case (?o) { o };
    };

    if (caller != owner) {
      Runtime.trap("Unauthorized: Can only view your own exam attempts");
    };

    let attempt = switch (attempts.get(attemptId)) {
      case (null) { Runtime.trap("Attempt not found") };
      case (?a) { a };
    };

    let question = switch (questions.get(questionId)) {
      case (null) { Runtime.trap("Question not found") };
      case (?q) { q };
    };

    let answerOpt = attempt.answers.find(func(a) { a.questionId == questionId });

    switch (answerOpt) {
      case (null) {
        {
          question;
          selectedOption = null;
          correct = false;
          userCorrect = false;
          originalAnswer = null;
        };
      };
      case (?answer) {
        {
          question;
          selectedOption = ?answer.selectedOption;
          correct = Text.equal(answer.selectedOption, question.answer);
          userCorrect = answer.correct;
          originalAnswer = ?answer.selectedOption;
        };
      };
    };
  };

  // User: Submit Exam
  public shared ({ caller }) func submitExam(attemptId : Nat, answers : [UserAnswer]) : async ExamResult {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only authenticated users can submit exams");
    };

    let owner = switch (attemptOwners.get(attemptId)) {
      case (null) { Runtime.trap("Attempt not found") };
      case (?o) { o };
    };

    if (caller != owner) {
      Runtime.trap("Unauthorized: Only can submit your own exam attempts");
    };

    let attempt = switch (attempts.get(attemptId)) {
      case (null) { Runtime.trap("Attempt not found") };
      case (?a) { a };
    };

    if (attempt.submitted) {
      Runtime.trap("Unauthorized: Cannot resubmit an already submitted exam");
    };

    let userId = attempt.userId;
    let timeElapsed = Time.now() - attempt.startTime;
    let timeRemaining = Int.max(0, attempt.timeLimit - timeElapsed);

    var correctCount = 0;
    let reviewList = List.empty<ExamQuestionReview>();

    for (answer in answers.vals()) {
      let question = switch (questions.get(answer.questionId)) {
        case (null) { Runtime.trap("Question not found") };
        case (?q) { q };
      };

      let isCorrect = Text.equal(answer.selectedOption, question.answer);
      if (isCorrect) {
        correctCount += 1;
      };

      let review : ExamQuestionReview = {
        question;
        selectedOption = ?answer.selectedOption;
        correct = isCorrect;
        userCorrect = isCorrect;
        originalAnswer = ?answer.selectedOption;
      };

      reviewList.add(review);
    };

    let totalQuestions = attempt.questionIds.size();
    let score = (correctCount * 100) / totalQuestions;
    let passed = score >= 60;

    let result : ExamResult = {
      attemptId;
      userId;
      score;
      timeRemaining;
      submitted = true;
      passed;
      examType = attempt.course;
      answers;
      questionReviews = reviewList.toArray();
    };

    let updatedAttempt : ExamAttempt = {
      attemptId = attempt.attemptId;
      userId = attempt.userId;
      course = attempt.course;
      questionIds = attempt.questionIds;
      startTime = attempt.startTime;
      timeLimit = attempt.timeLimit;
      submitted = true;
      answers;
    };

    attempts.add(attemptId, updatedAttempt);

    let userResults = switch (userExamResults.get(userId)) {
      case (null) { List.empty<ExamResult>() };
      case (?list) { list };
    };

    userResults.add(result);
    userExamResults.add(userId, userResults);

    result;
  };

  // User: Get Attempts
  public query ({ caller }) func getAttempts() : async [ExamResult] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only authenticated users can view attempts");
    };

    let userId = switch (callerToUserId.get(caller)) {
      case (null) { Runtime.trap("User ID not found") };
      case (?id) { id };
    };

    let attemptsList = switch (userExamResults.get(userId)) {
      case (null) { List.empty<ExamResult>() };
      case (?list) { list };
    };

    attemptsList.toArray();
  };

  // User: Get Exam Mode Review
  public query ({ caller }) func getExamModeReview() : async { examHistory : [ExamResult] } {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only authenticated users can view exam mode review");
    };

    let userId = switch (callerToUserId.get(caller)) {
      case (null) { Runtime.trap("User ID not found") };
      case (?id) { id };
    };

    let results = switch (userExamResults.get(userId)) {
      case (null) { List.empty<ExamResult>() };
      case (?list) { list };
    };

    {
      examHistory = results.toArray();
    };
  };

  // Add Analytics Event Function - Requires at least user permission
  public shared ({ caller }) func addAnalyticsEvent(eventType : Text, userId : ?UserId, details : Text) : async () {
    // Analytics events should only be recorded by authenticated users
    // This prevents anonymous spam and ensures data integrity
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only authenticated users can record analytics events");
    };

    let event : AnalyticsEvent = {
      eventType;
      timestamp = Time.now();
      userId;
      details;
    };

    analyticsEvents.add(event);
  };

  // Get Analytics Events (Admin Only)
  public query ({ caller }) func getAnalyticsEvents() : async [AnalyticsEvent] {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Only admins can view analytics events");
    };

    analyticsEvents.toArray();
  };
});

