import io from 'socket.io-client';

export const API_URL = 'http://10.10.75.23:5001';
export const SOCKET = io(API_URL);

export const allUsersRoute = `${API_URL}/api/user/allusers`;
export const allAdminsRoute = `${API_URL}/api/user/alladmins`;
export const getAllMessageRoute = `${API_URL}/api/messages/getmsg`;
export const sendMessageRoute = `${API_URL}/api/messages/addmsg`;
export const getAllMessagesRoute = `${API_URL}/api/messages/getmsgs`;
