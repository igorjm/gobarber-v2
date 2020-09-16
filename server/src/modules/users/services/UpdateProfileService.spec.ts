import AppError from '@shared/errors/AppError';

import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import UpdateProfileService from './UpdateProfileService';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let updateProfileService: UpdateProfileService;

describe('UpdateProfileAvatar', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();
    updateProfileService = new UpdateProfileService(
      fakeUsersRepository,
      fakeHashProvider,
    );
  });

  it('should be able to update user profile', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123',
    });

    const updateUser = await updateProfileService.execute({
      user_id: user.id,
      name: 'John tres',
      email: 'johntres@example.com',
    });

    expect(updateUser.name).toBe('John tres');
    expect(updateUser.email).toBe('johntres@example.com');
  });

  it('should not be able to update email to another user email', async () => {
    await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123',
    });

    const user = await fakeUsersRepository.create({
      name: 'Teste',
      email: 'test@example.com',
      password: '123',
    });

    await expect(
      updateProfileService.execute({
        user_id: user.id,
        name: 'John Doe',
        email: 'johndoe@example.com',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should be able to update user password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '1234',
    });

    const updateUser = await updateProfileService.execute({
      user_id: user.id,
      name: 'John tres',
      email: 'johntres@example.com',
      old_password: '1234',
      password: '123',
    });

    expect(updateUser.password).toBe('123');
  });

  it('should not be able to update user password without old password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '1234',
    });

    await expect(
      updateProfileService.execute({
        user_id: user.id,
        name: 'John tres',
        email: 'johntres@example.com',
        password: '123',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to update user password with wrong old password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '1234',
    });

    await expect(
      updateProfileService.execute({
        user_id: user.id,
        name: 'John tres',
        email: 'johntres@example.com',
        old_password: 'wrong-old-password',
        password: '123',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
