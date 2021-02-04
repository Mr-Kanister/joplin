import { createUserAndSession, beforeAllDb, afterAllTests, beforeEachDb, models, createFile } from '../utils/testing/testUtils';
import { shareWithUserAndAccept } from '../utils/testing/shareApiUtils';

describe('ShareUserModel', function() {

	beforeAll(async () => {
		await beforeAllDb('ShareUserModel');
	});

	afterAll(async () => {
		await afterAllTests();
	});

	beforeEach(async () => {
		await beforeEachDb();
	});

	test('should get the list of linked user IDs', async function() {
		const { user: user1, session: session1 } = await createUserAndSession(1);
		const { user: user2, session: session2 } = await createUserAndSession(2);
		const { user: user3, session: session3 } = await createUserAndSession(3);

		const file1a = await createFile(user1.id, 'root:/test1a.txt:', 'test1a');
		const file1b = await createFile(user1.id, 'root:/test1b.txt:', 'test1b');
		const file2 = await createFile(user2.id, 'root:/test2.txt:', 'test2');

		await shareWithUserAndAccept(session1.id, user1, session3.id, user3, file1a);
		await shareWithUserAndAccept(session1.id, user1, session3.id, user3, file1b);
		await shareWithUserAndAccept(session2.id, user1, session3.id, user3, file2);

		const userIds = await models().shareUser({ userId: user3.id }).linkedUserIds();
		userIds.sort();
		const expectedUserIds = [user1.id, user2.id];
		expectedUserIds.sort();

		expect(userIds).toEqual(expectedUserIds);
	});

});
