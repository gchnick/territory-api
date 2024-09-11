import { createMock, Mock } from "@/tests/utils/mock";

import { CommandBus } from "@/shared/domain/command-bus";

const createMockCommandBus = (): Mock<CommandBus> => createMock<CommandBus>();

export default createMockCommandBus;
