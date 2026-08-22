-- Re-uploading a file of the same type for a lecture should replace it.
alter table lecture_files
  add constraint lecture_files_lecture_id_type_key unique (lecture_id, type);
