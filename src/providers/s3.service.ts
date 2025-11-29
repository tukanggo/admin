import AWS from 'aws-sdk';
import { File } from 'formidable';
import fs from 'fs';
import _ from 'lodash';
import path from 'path';
import { Readable } from 'stream';
import { v4 as uuid } from 'uuid';
import dotenv from 'dotenv';

dotenv.config();

const { AWS_S3_BUCKET, AWS_ACCESS_KEY, AWS_SECRET_KEY, AWS_S3_REGION } = process.env;

type S3Body = string | Buffer | Uint8Array | Blob | Readable;
interface Options {
  publicAccess: boolean;
  contentType?: string;
}
const Options: Options = { publicAccess: true };
const Bucket = AWS_S3_BUCKET || '';

AWS.config.update({ accessKeyId: AWS_ACCESS_KEY, secretAccessKey: AWS_SECRET_KEY });
const s3Bucket = new AWS.S3({
  params: { Bucket, timeout: 6000000 },
  region: AWS_S3_REGION,
});

export const deleteObjectFromS3 = (filePath: string): Promise<AWS.S3.DeleteObjectOutput> =>
  new Promise((resolve, reject) => {
    s3Bucket.deleteObject({ Key: filePath, Bucket }, (error, data) => {
      if (error !== null) return reject(error);
      return resolve(data);
    });
  });

export const getObjectFromS3 = (filePath: string): Promise<AWS.S3.GetObjectOutput> =>
  new Promise((resolve, reject) => {
    s3Bucket.getObject({ Key: filePath, Bucket }, (error, data) => {
      if (error != null) {
        reject(error);
      } else {
        resolve(data);
      }
    });
  });

export const uploadObjectToS3 = (
  directory: string,
  stream: S3Body,
  extension: string,
  { publicAccess = true, contentType }: Options = Options,
): Promise<Uploaded> =>
  // eslint-disable-next-line consistent-return
  new Promise((resolve, reject) => {
    directoryValidator(directory);
    if (directory.substr(directory.length - 1) !== '/')
      return reject(new Error('uploadObjectToS3: last character of "directory" must be "/" '));
    // if (extension.charAt(0) !== '.') return reject(new Error('uploadObjectToS3: first character of "extension" must be "." '));

    const extra: { ACL?: string; ContentDisposition?: string; ContentType?: string } = {};
    if (publicAccess) extra.ACL = 'public-read';
    if (contentType) extra.ContentType = contentType;
    s3Bucket.upload(
      {
        Key: `${process.env.AWS_S3_DIRECTORY_PREFIX || ''}${directory}${uuid()}${extension}`,
        Bucket,
        Body: stream,
        ...extra,
      },
      (err, data) => {
        if (err) return reject(err);
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const key = _.get(data, 'Key') || _.get(data, 'key');
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        return resolve({ ...data, key });
      },
    );
  });
/**
 * Upload formidable file to S3
 - @param file - formidable parsed "File" object
 - @param directory - S3 directory path
 */
export const uploadFileToS3 = async (
  file: File,
  directory: string,
  option: Options = Options,
): Promise<Uploaded> => {
  try {
    directoryValidator(directory);
    const stream = fs.readFileSync(file.path);
    const extension = path.extname(file.name);
    const response = await uploadObjectToS3(directory, stream, extension, option);
    return Promise.resolve(response);
  } catch (e) {
    return Promise.reject(e);
  }
};

export const uploadReadableStreamToS3 = async (
  stream: S3Body,
  directory: string,
  filename: string,
  option: Options,
): Promise<Uploaded> => {
  try {
    directoryValidator(directory);
    const extension = path.extname(filename);
    const response = await uploadObjectToS3(directory, stream, extension, option);
    return Promise.resolve(response);
  } catch (e) {
    return Promise.reject(e);
  }
};

export class S3Service {
  deleteObjectFromS3 = deleteObjectFromS3;
  getObjectFromS3 = getObjectFromS3;
  uploadObjectToS3 = uploadObjectToS3;
  uploadFileToS3 = uploadFileToS3;
  uploadReadableStreamToS3 = uploadReadableStreamToS3;
}

interface Uploaded extends AWS.S3.ManagedUpload.SendData {
  key: string;
}

export const getFileSize = async (key: string) => {
  return s3Bucket
    .headObject({ Key: key, Bucket })
    .promise()
    .then((res) => res.ContentLength);
};

const directoryValidator = (directory: string) => {
  const str = directory;
  const firstChar = str.charAt(0);
  const lastChar = str.substr(str.length - 1);
  if (firstChar === '/')
    throw new Error(`First character of directory cant be "/". Current value "${directory}"`);
  if (lastChar !== '/')
    throw new Error(`Last character of directory must be "/". Current value "${directory}"`);
};

export const uploadReadableStreamToS32 = async (
  stream: S3Body,
  directory: string,
  filename: string,
  username: string,
  option: Options,
): Promise<Uploaded> => {
  try {
    directoryValidator(directory);
    const extension = path.extname(filename);
    const response = await uploadObjectToS32(directory, stream, extension, username, option);
    return Promise.resolve(response);
  } catch (e) {
    return Promise.reject(e);
  }
};

export const uploadObjectToS32 = (
  directory: string,
  stream: S3Body,
  extension: string,
  username: string,
  { publicAccess = true, contentType }: Options = Options,
): Promise<Uploaded> =>
  // eslint-disable-next-line consistent-return
  new Promise((resolve, reject) => {
    directoryValidator(directory);
    if (directory.substr(directory.length - 1) !== '/')
      return reject(new Error('uploadObjectToS3: last character of "directory" must be "/" '));
    // if (extension.charAt(0) !== '.') return reject(new Error('uploadObjectToS3: first character of "extension" must be "." '));

    const extra: { ACL?: string; ContentDisposition?: string; ContentType?: string } = {};
    if (publicAccess) extra.ACL = 'public-read';
    if (contentType) extra.ContentType = contentType;
    s3Bucket.upload(
      {
        Key: `${
          process.env.AWS_S3_DIRECTORY_PREFIX || ''
        }${directory}${username}_-_${uuid()}${extension}`,
        Bucket,
        Body: stream,
        ...extra,
      },
      (err, data) => {
        if (err) return reject(err);
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const key = _.get(data, 'Key') || _.get(data, 'key');
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        return resolve({ ...data, key });
      },
    );
  });
