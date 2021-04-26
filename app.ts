import express from 'express';
import cors from 'cors';
import { schedulesRouter } from './source/rest/schedules/schedules';
import { employeesRouter } from './source/rest/employees/employees';
const app = express();
const PORT = 4000 || process.env.port;
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));

app.use('/schedules', schedulesRouter);
app.use('/employees', employeesRouter);

app.listen(PORT, () => console.log(`Server is listening on port ${PORT}`));
