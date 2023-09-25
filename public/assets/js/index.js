// Cache DOM elements
const $noteTitle = $(".note-title");
const $noteText = $(".note-textarea");
const $saveNoteBtn = $(".save-note");
const $newNoteBtn = $(".new-note");
const $noteList = $(".list-container .list-group");

// Initialize activeNote
let activeNote = {};

// Function for making an AJAX request
const ajaxRequest = (url, data = {}, method = "GET") => {
  return $.ajax({
    url,
    data,
    method
  });
};

// Function for getting all notes from the server
const getNotes = () => {
  return ajaxRequest("/api/notes");
};

// Function for saving a note to the server
const saveNote = (note) => {
  return ajaxRequest("/api/notes", note, "POST");
};

// Function for deleting a note from the server
const deleteNote = (id) => {
  return ajaxRequest(`api/notes/${id}`, {}, "DELETE");
};

// Function to render the active note
const renderActiveNote = () => {
  $saveNoteBtn.hide();

  if (activeNote.id) {
    $noteTitle.add($noteText).attr("readonly", true);
    $noteTitle.val(activeNote.title);
    $noteText.val(activeNote.text);
  } else {
    $noteTitle.add($noteText).attr("readonly", false);
    $noteTitle.val("");
    $noteText.val("");
  }
};

// Function to handle saving a note
const handleNoteSave = () => {
  const newNote = {
    title: $noteTitle.val(),
    text: $noteText.val()
  };

  saveNote(newNote)
    .then(getAndRenderNotes)
    .then(renderActiveNote);
};

// Function to handle deleting a note
const handleNoteDelete = (event) => {
  event.stopPropagation();

  const noteId = $(event.target).data("id");

  if (activeNote.id === noteId) {
    activeNote = {};
  }

  deleteNote(noteId)
    .then(getAndRenderNotes)
    .then(renderActiveNote);
};

// Function to set the active note and display it
const handleNoteView = (event) => {
  activeNote = $(event.target).data();
  renderActiveNote();
};

// Function to handle creating a new note
const handleNewNoteView = () => {
  activeNote = {};
  renderActiveNote();
};

// Function to handle rendering the save button
const handleRenderSaveBtn = () => {
  $saveNoteBtn.toggle(!!$noteTitle.val().trim() && !!$noteText.val().trim());
};

// Function to render the list of note titles
const renderNoteList = (notes) => {
  $noteList.empty();

  const noteListItems = notes.map((note, index) => {
    const $li = $("<li class='list-group-item'>").data(note);
    $li.data('id', index);

    const $span = $("<span>").text(note.title);
    const $delBtn = $(
      `<i class='fas fa-trash-alt float-right text-danger delete-note' data-id=${index}>`
    );

    $li.append($span, $delBtn);
    return $li;
  });

  $noteList.append(noteListItems);
};

// Function to get and render the initial list of notes
const getAndRenderNotes = () => {
  return getNotes().then(renderNoteList);
};

// Event handlers
$saveNoteBtn.on("click", handleNoteSave);
$noteList.on("click", ".list-group-item", handleNoteView);
$newNoteBtn.on("click", handleNewNoteView);
$noteList.on("click", ".delete-note", handleNoteDelete);
$noteTitle.add($noteText).on("keyup", handleRenderSaveBtn);

// Get and render the initial list of notes
getAndRenderNotes().then(renderActiveNote);
