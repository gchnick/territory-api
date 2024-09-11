import { createMock, Mock } from "@/tests/utils/mock";

import Logger from "@/shared/domain/logger";

const createMockLogger = (): Mock<Logger> => createMock<Logger>();

export default createMockLogger;
