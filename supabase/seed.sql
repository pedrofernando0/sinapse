do $$
declare
  student_demo_email text := 'demo.aluno.pedro@sinapse.app';
  teacher_demo_email text := 'demo.professor.pedro@sinapse.app';
  student_demo_user_id uuid;
  teacher_demo_user_id uuid;
begin
  select id into student_demo_user_id
  from auth.users
  where lower(email) = lower(student_demo_email)
  order by created_at desc
  limit 1;

  select id into teacher_demo_user_id
  from auth.users
  where lower(email) = lower(teacher_demo_email)
  order by created_at desc
  limit 1;

  if student_demo_user_id is null then
    raise exception 'Demo student user not found. Run scripts/provision-demo-users.mjs before seeding.';
  end if;

  if teacher_demo_user_id is null then
    raise exception 'Demo teacher user not found. Run scripts/provision-demo-users.mjs before seeding.';
  end if;

  update public.profiles
  set
    full_name = 'Pedro Demo',
    role = 'aluno',
    hidden_student_views = '{}'
  where user_id = student_demo_user_id;

  update public.profiles
  set
    full_name = 'Pedro Demo',
    role = 'professor',
    hidden_student_views = '{}'
  where user_id = teacher_demo_user_id;

  insert into public.student_notifications (user_id, title, body, priority, read, created_at)
  select
    student_demo_user_id,
    seed.title,
    seed.body,
    seed.priority,
    seed.read,
    seed.created_at
  from (
    values
      (
        'Revisao agendada para hoje',
        'Sua revisao de Biologia sobre Ecologia vence as 19h.',
        'warning',
        false,
        timezone('utc', now()) - interval '2 hours'
      ),
      (
        'Tutoria com IA liberada',
        'Seu tutor ja pode montar um plano para o proximo simulado.',
        'success',
        false,
        timezone('utc', now()) - interval '6 hours'
      ),
      (
        'Prazo importante',
        'As inscricoes do ENEM entram na janela de atencao nesta semana.',
        'danger',
        true,
        timezone('utc', now()) - interval '1 day'
      )
  ) as seed(title, body, priority, read, created_at)
  where not exists (
    select 1
    from public.student_notifications
    where user_id = student_demo_user_id
      and title = seed.title
  );

  insert into public.student_revisions (id, user_id, subject, topic, scheduled_for, status)
  values
    ('40cc5d0b-0c68-4d1d-a3e3-f0a95d2b30b1', student_demo_user_id, 'Matematica', 'Geometria Espacial', current_date, 'pending'),
    ('1bd9823f-5d60-4d48-8b90-8c15e4546cdf', student_demo_user_id, 'Biologia', 'Ecologia', current_date - 2, 'done'),
    ('1ff243ef-ed91-4d4d-b3f5-abef620423aa', student_demo_user_id, 'Quimica', 'Estequiometria', current_date + 2, 'pending')
  on conflict (id) do update
  set
    subject = excluded.subject,
    topic = excluded.topic,
    scheduled_for = excluded.scheduled_for,
    status = excluded.status,
    updated_at = timezone('utc', now());

  insert into public.student_mock_exams (id, user_id, name, exam_date, correct_answers, total_questions, duration_minutes)
  values
    ('f91d0e82-14a4-41a9-a669-1eb68294ad3d', student_demo_user_id, 'ENEM 2024 - Dia 1', current_date - 30, 72, 90, 255),
    ('36404a6d-a59b-4a36-95af-4df81920996d', student_demo_user_id, 'FUVEST 2025 - 1a Fase', current_date - 14, 51, 90, 240)
  on conflict (id) do update
  set
    name = excluded.name,
    exam_date = excluded.exam_date,
    correct_answers = excluded.correct_answers,
    total_questions = excluded.total_questions,
    duration_minutes = excluded.duration_minutes,
    updated_at = timezone('utc', now());
end;
$$;
