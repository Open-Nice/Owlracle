'use server'

import { auth } from '@/auth'
import { supabaseClient } from '@/app/supaClient'

export async function getUser(){
  const session = await auth()
  return session.user;
}

// Upload file using standard upload
export async function uploadFile(description : string, form: FormData, user : string) {
  const file:File = form?.get("file") as File;
  var storename = Date.now() + file.name
  const { data, error } = await supabaseClient.storage.from('UserFile').upload(storename, file)
  if (error) {
    return (error.message)
  } else {
    const { error } = await supabaseClient.from('FileNode').insert({ description: description, name: file.name, type: file.type, location: storename, owner: user})
    //Error handling
    return 0
  }
}

export async function uploadURL(description: string, url : string, user : string) {
    const { error } = await supabaseClient.from('FileNode').insert({ description: description, type: "url", location: url, owner: user})
    //Error handling
    if (error) {
      return (error.message)
    }
    return 0
}

export async function getUserFileEntries(user : string) {
    const { data, error } = await supabaseClient.from('FileNode').select().eq('owner', user)
}


//files should be a list of file location, which is in the location column from data you get from getUserFileEntries
export async function deleteFile(files: string[]) {
    const { data, error } = await supabaseClient.storage.from('UserFile').remove(files)
}