import 'dotenv/config'
import { main } from "../src/main";
import supertest from "supertest";
import { UtilsTest } from "./test.util";

const request = supertest(main);

const roleIdHR = "dfa8b19f-2b0c-4b74-b74b-5220d999f5f8"

const validSigninRequest = {
  "email": "unittest@unittest.unittest",
  "password": "unittest",
  "fcm": "unittest",
  "device_id": "unittest"
}

const expectErrorWithMessage = (response: any) => {
  expect(response.status).toEqual(400);
  expect(response.body.error).toBeDefined();
  expect(response.body.errorMessage).toBeDefined()
}
const expectError = (response: any) => {
  expect(response.status).toEqual(400);
  expect(response.body.error).toBeDefined();
}
describe('POST auth/signin', () => {
  describe('testing with data profile and account', () => {
    beforeEach(async () => {
      await UtilsTest.createDataUser()
    })

    afterEach(async () => {
      await UtilsTest.deleteDataUser()
    })

    it('should login', async () => {
      const response = await request.post('/auth/signin')
        .send(validSigninRequest)
      expect(response.status).toEqual(200);
      expect(response.body.data.access_token).toBeDefined();
      expect(response.body.data.refresh_token).toBeDefined();
      const account = await UtilsTest.getAccount({refresh_token:response.body.data.refresh_token})
      expect(account!.is_logged_in).toBe(true)
      expect(account!.access_token).toBeDefined()
      expect(account!.refresh_token).toBeDefined()
      expect(account!.fcm).toBeDefined()
      expect(account!.device_id).toBeDefined()
    });

    for (const item in validSigninRequest) {
      it(`reject if ${item} is undefined`, async () => {
        const response = await request.post('/auth/signin')
          .send(validSigninRequest)
          .send({ [`${item}`]: undefined })
        expect(response.status).toEqual(400);
        expect(response.body.error).toBeDefined();
        expect(response.body.error).toContain('Validation Error');
      });
    }

    for (const item in validSigninRequest) {
      it(`reject if ${item} is empty`, async () => {
        const response = await request.post('/auth/signin')
          .send(validSigninRequest)
          .send({ [`${item}`]: "" })
        expect(response.status).toEqual(400);
        expect(response.body.error).toBeDefined();
        expect(response.body.error).toContain('Validation Error');
      });
    }

    it('reject if user account not found', async () => {
      const response = await request.post('/auth/signin')
        .send(validSigninRequest)
        .send({ email: `123${validSigninRequest.email}` })
      expectErrorWithMessage(response)
    });

    it('reject if wrong email password', async () => {
      const response = await request.post('/auth/signin')
        .send(validSigninRequest)
        .send({ password: `${validSigninRequest.password}123` })
      expectErrorWithMessage(response)
    });

  })

  describe('testing with wrong data profile and account', () => {
    beforeEach(async () => {
      await UtilsTest.createAccount()
    })

    afterEach(async () => {
      await UtilsTest.deleteDataUser()
    })

    it('reject if user profile not found', async () => {
      const response = await request.post('/auth/signin')
        .send(validSigninRequest)
      expectErrorWithMessage(response)
    });

    it('reject if user role not found', async () => {
      await UtilsTest.createProfile('08a9e8db-a10c-49e5-bdb6-b66efebab220')
      const response = await request.post('/auth/signin')
        .send(validSigninRequest)
      expectErrorWithMessage(response)
    });

    it('reject if user role is not User (for mobile)', async () => {
      await UtilsTest.createProfile(roleIdHR)
      const response = await request.post('/auth/signin')
        .send(validSigninRequest)
      expectErrorWithMessage(response)
    });
  })
})

describe('POST auth/signInByToken', () => {
  afterEach(async () => {
    await UtilsTest.deleteDataUser()
  })

  it('should signin', async () => {
    await UtilsTest.createDataUser()
    const signin = await request.post('/auth/signin')
      .send(validSigninRequest)

    const response = await request.post('/auth/signInByToken')
      .set({
        'Authorization': `Bearer ${signin.body.data.refresh_token}`,
      })

    expect(response.status).toEqual(200);
    expect(response.body.data.access_token).toBeDefined();
    const account = await UtilsTest.getAccount({access_token:response.body.data.access_token})
    expect(account!.is_logged_in).toBe(true)
    expect(account!.access_token).toBeDefined()
    expect(account!.refresh_token).toBeDefined()
    expect(account!.fcm).toBeDefined()
    expect(account!.device_id).toBeDefined()
  })

  it('reject if header auth not defined', async () => {
    const response = await request.post('/auth/signInByToken')
    expectError(response)

  })

  it('reject if invalid token (not contain bearer)', async () => {
    const response = await request.post('/auth/signInByToken')
      .set({
        'Authorization': `testing`,
      })
      expectError(response)
  })

  it('reject if different refreshToken', async () => {
    await UtilsTest.createDataUser()
    const signin = await request.post('/auth/signin')
      .send(validSigninRequest)
    const response = await request.post('/auth/signInByToken')
      .set({
        'Authorization': `Bearer ${signin.body.data.access_token}`,
      })
    expectErrorWithMessage(response)
  })

  it('reject if user account not found', async () => {
    await UtilsTest.createDataUser()
    const signin = await request.post('/auth/signin')
      .send(validSigninRequest)
    await UtilsTest.deleteAccount()
    const response = await request.post('/auth/signInByToken')
      .set({
        'Authorization': `Bearer ${signin.body.data.refresh_token}`,
      })
    expectErrorWithMessage(response)
  })
  it('reject if user profile not found', async () => {
    await UtilsTest.createDataUser()
    const signin = await request.post('/auth/signin')
      .send(validSigninRequest)
    await UtilsTest.deleteProfile()
    const response = await request.post('/auth/signInByToken')
      .set({
        'Authorization': `Bearer ${signin.body.data.refresh_token}`,
      })
    expectErrorWithMessage(response)
  })
  it('reject if user role not found', async () => {
    await UtilsTest.createDataUser()
    const signin = await request.post('/auth/signin')
      .send(validSigninRequest)
    await UtilsTest.deleteDataUser()

    await UtilsTest.createAccount()
    await UtilsTest.createProfile('08a9e8db-a10c-49e5-bdb6-b66efebab220')
    const response = await request.post('/auth/signInByToken')
      .set({
        'Authorization': `Bearer ${signin.body.data.refresh_token}`,
      })
    expectErrorWithMessage(response)
  })
  it('reject if user role is not User (for mobile)', async () => {
    await UtilsTest.createDataUser()
    const signin = await request.post('/auth/signin')
      .send(validSigninRequest)
    await UtilsTest.deleteDataUser()

    await UtilsTest.createAccount()
    await UtilsTest.createProfile(roleIdHR)
    const response = await request.post('/auth/signInByToken')
      .set({
        'Authorization': `Bearer ${signin.body.data.refresh_token}`,
      })
    expectErrorWithMessage(response)
  })
})

describe('POST auth/logout', () => {
  beforeEach(async () => {
    await UtilsTest.createDataUser()
  })

  afterEach(async () => {
    await UtilsTest.deleteDataUser()
  })

  it('should logout', async () => {
    const signin = await request.post('/auth/signin')
    .send(validSigninRequest)

    const response = await request.post('/auth/logout')
    .set({
      'Authorization': `Bearer ${signin.body.data.access_token}`,
    })
    expect(response.status).toEqual(200);
    expect(response.body.data.message).toBeDefined()
    expect(response.body.data.messageDisplay).toBeDefined()
    expect(response.status).toEqual(200);
    const account = await UtilsTest.getAccount({email:"unittest@unittest.unittest"})
    expect(account!.is_logged_in).toBe(false)
    expect(account!.access_token).toBeNull()
    expect(account!.refresh_token).toBeNull()
    expect(account!.device_id).toBeNull()
  })
  it('reject if header auth not defined', async () => {
    const response = await request.post('/auth/logout')
    expectError(response)
  })
  it('reject if invalid token (not contain bearer)', async () => {
    const response = await request.post('/auth/logout')
      .set({
        'Authorization': `testing`,
      })
      expectError(response)
  })
  it('reject if different accessToken', async () => {
    const signin = await request.post('/auth/signin')
      .send(validSigninRequest)
    const response = await request.post('/auth/logout')
      .set({
        'Authorization': `Bearer ${signin.body.data.refresh_token}`,
      })
    expectErrorWithMessage(response)
  })
  it('reject if user account not found', async () => {
    const signin = await request.post('/auth/signin')
      .send(validSigninRequest)
    await UtilsTest.deleteAccount()
    const response = await request.post('/auth/logout')
    .set({
      'Authorization': `Bearer ${signin.body.data.access_token}`,
    })
    expectErrorWithMessage(response)
  })
})

describe('POST auth/forgotPassword', () => {
  beforeEach(async () => {
    await UtilsTest.createDataUser()
  })

  afterEach(async () => {
    await UtilsTest.deleteDataUser()
  })
  it('should change password', async () => {
    const oldAccount = await UtilsTest.getAccount({
      email:validSigninRequest.email
    })
    const response = await request.post('/auth/forgotPassword')
      .send({email:validSigninRequest.email})

    const currentAccount = await UtilsTest.getAccount({
      email:validSigninRequest.email
    })

    expect(response.status).toEqual(200);
    expect(oldAccount!.password).not.toEqual(currentAccount!.password);
    expect(response.body.data.message).toBeDefined()
    expect(response.body.data.messageDisplay).toBeDefined()
  })
  it('reject if user account not found', async () => {
    const response = await request.post('/auth/forgotPassword')
      .send({ email: `123${validSigninRequest.email}` })
    expectErrorWithMessage(response)
  })
  it(`reject if email is undefined`, async () => {
    const response = await request.post('/auth/forgotPassword')
      .send({ email : undefined })
    expect(response.status).toEqual(400);
    expect(response.body.error).toBeDefined();
    expect(response.body.error).toContain('Validation Error');
  });
  it(`reject if email is empty`, async () => {
    const response = await request.post('/auth/forgotPassword')
      .send({ email: "" })
    expect(response.status).toEqual(400);
    expect(response.body.error).toBeDefined();
    expect(response.body.error).toContain('Validation Error');
  });
})