import { Models } from 'appwrite';
import React from 'react'
import UserCard from './UserCard/UserCard';

type UserCardProp = {
  users: Models.DocumentList<Models.Document>
}

function UserCards({users}: UserCardProp) {
  
  return (
    <div>
      <div className="flex flex-col gap-10">
      {users?.documents.map((user: Models.Document) => (
        <div key={user.$id}>
          <UserCard user={user} />
        </div>
      ))}
    </div>
    </div>
  )
}

export default UserCards