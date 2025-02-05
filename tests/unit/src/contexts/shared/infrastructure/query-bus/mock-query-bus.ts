import { createMock, Mock } from "@/tests/utils/mock";

import { QueryBus } from "@/shared/domain/query-bus";

const createMockQueryBus = (): Mock<QueryBus> => createMock<QueryBus>();

export default createMockQueryBus;
