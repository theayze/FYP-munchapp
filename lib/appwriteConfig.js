import { Account, Profilepictures, Client, Databases, ID } from 'react-native-appwrite';

export const config = {
    endpoint: 'https://cloud.appwrite.io/v1',
    platform: 'com.fyp.bitebond',
    projectId: '663d4120002686669589',
    databaseId: '6644c32a002e6d1103c7',
    userCollectionId: '6644c3f700174b519e3e',
    postCollectionId: '6644c42f003100807090',
    storageId: '6644c737000c6fe5892e'
}

// Init your React Native SDK
const client = new Client();

client
    .setEndpoint(config.endpoint) // My Appwrite Endpoint
    .setProject(config.projectId) // My project ID
    .setPlatform(config.platform) // My application ID or bundle ID.
    ;

const account = new Account(client);
const profilepictures = new Profilepictures(client);
const databases = new Databases(client);

// Register User

export const createUser = async (email, password, username, fullname) => {
    try {
        const newAccount = await account.create(
            ID.unique(),
            email,
            password,
            username,
            fullname
        );

        if (!newAccount) throw Error;

        const profilepictureUrl = profilepictures.getInitials(username);

        await signIn(email, password);

        const newUser = await databases.createDocument(
            config.databaseId,
            config.userCollectionId,
            ID.unique(),

            {
                accountId: newAccount.$id,
                email,
                username,
                fullname,
                profilepicture: profilepictureUrl
            }
        );

        return newUser;
    } catch (error) {
        console.log(error);
        throw new Error(error);
    }

}

export async function signIn(email, password) {
    try {
        const session = await account.createEmailPasswordSession(email, password)

        return session;
    } catch (error) {
        throw new Error(error);
    }
}


