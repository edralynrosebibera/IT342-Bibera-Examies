import os
import shutil
from pathlib import Path

root = Path(r"c:\Users\Edralyn\Desktop\IT342SUPERLEGIT\IT342-Bibera-Examies\examies\src\main\java\edu\cit\bibera\examies")

moves = {
    'controller/AttemptController.java': 'features/attempts/controller/AttemptController.java',
    'controller/ClassesController.java': 'features/classes/controller/ClassesController.java',
    'controller/EnrollmentController.java': 'features/classes/controller/EnrollmentController.java',
    'controller/ExamController.java': 'features/exams/controller/ExamController.java',
    'controller/QuestionController.java': 'features/questions/controller/QuestionController.java',
    'entity/AttemptAnswerEntity.java': 'features/attempts/entity/AttemptAnswerEntity.java',
    'entity/AttemptEntity.java': 'features/attempts/entity/AttemptEntity.java',
    'entity/ClassesEntity.java': 'features/classes/entity/ClassesEntity.java',
    'entity/EnrollmentEntity.java': 'features/classes/entity/EnrollmentEntity.java',
    'entity/ExamEntity.java': 'features/exams/entity/ExamEntity.java',
    'entity/QuestionEntity.java': 'features/questions/entity/QuestionEntity.java',
    'entity/QuestionOptionEntity.java': 'features/questions/entity/QuestionOptionEntity.java',
    'repository/AttemptAnswerRepository.java': 'features/attempts/repository/AttemptAnswerRepository.java',
    'repository/AttemptRepository.java': 'features/attempts/repository/AttemptRepository.java',
    'repository/ClassesRepository.java': 'features/classes/repository/ClassesRepository.java',
    'repository/EnrollmentRepository.java': 'features/classes/repository/EnrollmentRepository.java',
    'repository/ExamClassRepository.java': 'features/classes/repository/ExamClassRepository.java',
    'repository/ExamRepository.java': 'features/exams/repository/ExamRepository.java',
    'repository/QuestionOptionRepository.java': 'features/questions/repository/QuestionOptionRepository.java',
    'repository/QuestionRepository.java': 'features/questions/repository/QuestionRepository.java',
    'service/AttemptService.java': 'features/attempts/service/AttemptService.java',
    'service/ClassesService.java': 'features/classes/service/ClassesService.java',
    'service/EnrollmentService.java': 'features/classes/service/EnrollmentService.java',
    'service/ExamService.java': 'features/exams/service/ExamService.java',
    'dto/AuthResponse.java': 'features/auth/dto/AuthResponse.java',
    'dto/SignUpRequest.java': 'features/auth/dto/SignUpRequest.java',
    'dto/SupabaseAuthResponse.java': 'features/auth/dto/SupabaseAuthResponse.java',
    'dto/SupabaseSignInRequest.java': 'features/auth/dto/SupabaseSignInRequest.java',
    'dto/SupabaseSignUpOptions.java': 'features/auth/dto/SupabaseSignUpOptions.java',
    'dto/SupabaseSignUpRequest.java': 'features/auth/dto/SupabaseSignUpRequest.java',
    'dto/UpdateProfileRequest.java': 'features/users/dto/UpdateProfileRequest.java',
    'dto/UsersDTO.java': 'features/users/dto/UsersDTO.java',
    'dto/CreateClassRequest.java': 'features/classes/dto/CreateClassRequest.java',
    'dto/JoinClassRequest.java': 'features/classes/dto/JoinClassRequest.java',
    'dto/ClassEnrollmentDto.java': 'features/classes/dto/ClassEnrollmentDto.java',
    'dto/QuestionResponse.java': 'features/questions/dto/QuestionResponse.java',
    'dto/QuestionOptionResponse.java': 'features/questions/dto/QuestionOptionResponse.java',
    'model/ExamClass.java': 'features/classes/entity/ExamClass.java',
}

for src_rel, dst_rel in moves.items():
    src = root / src_rel
    dst = root / dst_rel
    if not src.exists():
        continue
    dst.parent.mkdir(parents=True, exist_ok=True)
    print(f"Moving {src_rel} -> {dst_rel}")
    if dst.exists():
        print(f"Target exists, removing old destination {dst}")
        dst.unlink()
    shutil.move(str(src), str(dst))

# Update package declarations for moved files to match destination path.
for dirpath, _, filenames in os.walk(root):
    if not dirpath.startswith(str(root)):
        continue
    for fname in filenames:
        if not fname.endswith('.java'):
            continue
        path = Path(dirpath) / fname
        rel = path.relative_to(root)
        package = 'edu.cit.bibera.examies.' + '.'.join(rel.parent.parts) if rel.parent.parts else 'edu.cit.bibera.examies'
        lines = path.read_text(encoding='utf-8').splitlines()
        if not lines:
            continue
        if lines[0].startswith('package '):
            lines[0] = f'package {package};'
        else:
            lines.insert(0, f'package {package};')
        path.write_text('\n'.join(lines) + '\n', encoding='utf-8')

# Fix import references for moved classes/dtos.
import_map = {
    'edu.cit.bibera.examies.dto.AuthRequest': 'edu.cit.bibera.examies.features.auth.dto.AuthRequest',
    'edu.cit.bibera.examies.dto.AuthResponse': 'edu.cit.bibera.examies.features.auth.dto.AuthResponse',
    'edu.cit.bibera.examies.dto.SignUpRequest': 'edu.cit.bibera.examies.features.auth.dto.SignUpRequest',
    'edu.cit.bibera.examies.dto.SupabaseAuthResponse': 'edu.cit.bibera.examies.features.auth.dto.SupabaseAuthResponse',
    'edu.cit.bibera.examies.dto.SupabaseSignInRequest': 'edu.cit.bibera.examies.features.auth.dto.SupabaseSignInRequest',
    'edu.cit.bibera.examies.dto.SupabaseSignUpOptions': 'edu.cit.bibera.examies.features.auth.dto.SupabaseSignUpOptions',
    'edu.cit.bibera.examies.dto.SupabaseSignUpRequest': 'edu.cit.bibera.examies.features.auth.dto.SupabaseSignUpRequest',
    'edu.cit.bibera.examies.dto.UpdateProfileRequest': 'edu.cit.bibera.examies.features.users.dto.UpdateProfileRequest',
    'edu.cit.bibera.examies.dto.UsersDTO': 'edu.cit.bibera.examies.features.users.dto.UsersDTO',
    'edu.cit.bibera.examies.dto.CreateClassRequest': 'edu.cit.bibera.examies.features.classes.dto.CreateClassRequest',
    'edu.cit.bibera.examies.dto.JoinClassRequest': 'edu.cit.bibera.examies.features.classes.dto.JoinClassRequest',
    'edu.cit.bibera.examies.dto.ClassEnrollmentDto': 'edu.cit.bibera.examies.features.classes.dto.ClassEnrollmentDto',
    'edu.cit.bibera.examies.dto.QuestionResponse': 'edu.cit.bibera.examies.features.questions.dto.QuestionResponse',
    'edu.cit.bibera.examies.dto.QuestionOptionResponse': 'edu.cit.bibera.examies.features.questions.dto.QuestionOptionResponse',
    'edu.cit.bibera.examies.entity.AttemptAnswerEntity': 'edu.cit.bibera.examies.features.attempts.entity.AttemptAnswerEntity',
    'edu.cit.bibera.examies.entity.AttemptEntity': 'edu.cit.bibera.examies.features.attempts.entity.AttemptEntity',
    'edu.cit.bibera.examies.entity.ClassesEntity': 'edu.cit.bibera.examies.features.classes.entity.ClassesEntity',
    'edu.cit.bibera.examies.entity.EnrollmentEntity': 'edu.cit.bibera.examies.features.classes.entity.EnrollmentEntity',
    'edu.cit.bibera.examies.entity.ExamEntity': 'edu.cit.bibera.examies.features.exams.entity.ExamEntity',
    'edu.cit.bibera.examies.entity.QuestionEntity': 'edu.cit.bibera.examies.features.questions.entity.QuestionEntity',
    'edu.cit.bibera.examies.entity.QuestionOptionEntity': 'edu.cit.bibera.examies.features.questions.entity.QuestionOptionEntity',
    'edu.cit.bibera.examies.model.ExamClass': 'edu.cit.bibera.examies.features.classes.entity.ExamClass',
    'edu.cit.bibera.examies.repository.AttemptAnswerRepository': 'edu.cit.bibera.examies.features.attempts.repository.AttemptAnswerRepository',
    'edu.cit.bibera.examies.repository.AttemptRepository': 'edu.cit.bibera.examies.features.attempts.repository.AttemptRepository',
    'edu.cit.bibera.examies.repository.ClassesRepository': 'edu.cit.bibera.examies.features.classes.repository.ClassesRepository',
    'edu.cit.bibera.examies.repository.EnrollmentRepository': 'edu.cit.bibera.examies.features.classes.repository.EnrollmentRepository',
    'edu.cit.bibera.examies.repository.ExamClassRepository': 'edu.cit.bibera.examies.features.classes.repository.ExamClassRepository',
    'edu.cit.bibera.examies.repository.ExamRepository': 'edu.cit.bibera.examies.features.exams.repository.ExamRepository',
    'edu.cit.bibera.examies.repository.QuestionOptionRepository': 'edu.cit.bibera.examies.features.questions.repository.QuestionOptionRepository',
    'edu.cit.bibera.examies.repository.QuestionRepository': 'edu.cit.bibera.examies.features.questions.repository.QuestionRepository',
    'edu.cit.bibera.examies.repository.UsersRepository': 'edu.cit.bibera.examies.features.auth.repository.UsersRepository',
    'edu.cit.bibera.examies.service.AttemptService': 'edu.cit.bibera.examies.features.attempts.service.AttemptService',
    'edu.cit.bibera.examies.service.ClassesService': 'edu.cit.bibera.examies.features.classes.service.ClassesService',
    'edu.cit.bibera.examies.service.EnrollmentService': 'edu.cit.bibera.examies.features.classes.service.EnrollmentService',
    'edu.cit.bibera.examies.service.ExamService': 'edu.cit.bibera.examies.features.exams.service.ExamService',
    'edu.cit.bibera.examies.service.AuthService': 'edu.cit.bibera.examies.features.auth.service.AuthService',
}

# Also move old UsersController package if any remains

for dirpath, _, filenames in os.walk(root):
    if not dirpath.startswith(str(root)):
        continue
    for fname in filenames:
        if not fname.endswith('.java'):
            continue
        path = Path(dirpath) / fname
        text = path.read_text(encoding='utf-8')
        for old, new in import_map.items():
            text = text.replace(f'import {old};', f'import {new};')
        path.write_text(text, encoding='utf-8')

# Remove empty legacy directories if empty
legacy_dirs = ['controller', 'entity', 'repository', 'service', 'dto', 'model', 'config']
for d in legacy_dirs:
    p = root / d
    if p.exists() and p.is_dir() and not any(p.iterdir()):
        print(f"Removing empty legacy dir {p}")
        p.rmdir()

print('Done')
