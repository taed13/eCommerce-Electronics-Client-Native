import io from 'socket.io-client';
import { APP_CONFIG } from './common';

export const SOCKET = io(APP_CONFIG.API_URL);

export const allUsersRoute = `${APP_CONFIG.BASE_URL}user/allusers`;
export const allAdminsRoute = `${APP_CONFIG.BASE_URL}user/alladmins`;
export const getAllMessageRoute = `${APP_CONFIG.BASE_URL}messages/getmsg`;
export const sendMessageRoute = `${APP_CONFIG.BASE_URL}messages/addmsg`;
export const getAllMessagesRoute = `${APP_CONFIG.BASE_URL}messages/getmsgs`;
