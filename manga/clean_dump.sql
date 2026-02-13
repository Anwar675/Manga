--
-- PostgreSQL database dump
--

\restrict mr8E2WkGCRGU5BMJ4bFDx0SRu9koV7XsdUKCdqSKmPrzX9fnB4HlvOfN2drOHDe

-- Dumped from database version 18.1
-- Dumped by pg_dump version 18.1

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: public; Type: SCHEMA; Schema: -; Owner: -
--

-- *not* creating schema, since initdb creates it


--
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON SCHEMA public IS '';


--
-- Name: enum_categories_type; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.enum_categories_type AS ENUM (
    'menu',
    'genre',
    'ranking',
    'other'
);


--
-- Name: enum_chapters_status; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.enum_chapters_status AS ENUM (
    'published'
);


--
-- Name: enum_comments_type; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.enum_comments_type AS ENUM (
    'user',
    'admin',
    'translator',
    'superadmin'
);


--
-- Name: enum_effect_comments_effect; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.enum_effect_comments_effect AS ENUM (
    'none',
    'glow',
    'confetti'
);


--
-- Name: enum_effect_comments_tag; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.enum_effect_comments_tag AS ENUM (
    'important',
    'normal',
    'release'
);


--
-- Name: enum_mangas_age_rating; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.enum_mangas_age_rating AS ENUM (
    'all',
    '13+',
    '16+',
    '18+'
);


--
-- Name: enum_mangas_status; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.enum_mangas_status AS ENUM (
    'Đang cập nhập',
    'Đã hoàn thành',
    'hiatus'
);


--
-- Name: enum_users_role; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.enum_users_role AS ENUM (
    'user',
    'translator',
    'admin',
    'superadmin'
);


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: authors; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.authors (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name character varying NOT NULL,
    slug character varying,
    bio character varying,
    avatar_id uuid,
    updated_at timestamp(3) with time zone DEFAULT now() NOT NULL,
    created_at timestamp(3) with time zone DEFAULT now() NOT NULL
);


--
-- Name: banners; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.banners (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    title character varying,
    image_id uuid NOT NULL,
    link character varying,
    "order" numeric DEFAULT 0,
    active boolean DEFAULT true,
    updated_at timestamp(3) with time zone DEFAULT now() NOT NULL,
    created_at timestamp(3) with time zone DEFAULT now() NOT NULL
);


--
-- Name: categories; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.categories (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name character varying NOT NULL,
    slug character varying NOT NULL,
    type public.enum_categories_type NOT NULL,
    parent_id uuid,
    "order" numeric DEFAULT 0,
    updated_at timestamp(3) with time zone DEFAULT now() NOT NULL,
    created_at timestamp(3) with time zone DEFAULT now() NOT NULL
);


--
-- Name: chapters; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.chapters (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    manga_id uuid NOT NULL,
    title character varying NOT NULL,
    chapter_number numeric NOT NULL,
    slug character varying,
    views numeric DEFAULT 0,
    status public.enum_chapters_status DEFAULT 'published'::public.enum_chapters_status,
    created_by_id uuid,
    published_at timestamp(3) with time zone,
    updated_at timestamp(3) with time zone DEFAULT now() NOT NULL,
    created_at timestamp(3) with time zone DEFAULT now() NOT NULL
);


--
-- Name: chapters_pages; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.chapters_pages (
    _order integer NOT NULL,
    _parent_id uuid NOT NULL,
    id character varying NOT NULL,
    image_id uuid NOT NULL,
    "order" numeric NOT NULL
);


--
-- Name: chapters_rels; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.chapters_rels (
    id integer NOT NULL,
    "order" integer,
    parent_id uuid NOT NULL,
    path character varying NOT NULL,
    media_id uuid
);


--
-- Name: chapters_rels_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.chapters_rels_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: chapters_rels_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.chapters_rels_id_seq OWNED BY public.chapters_rels.id;


--
-- Name: comments; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.comments (
    id uuid DEFAULT gen_random_uuid() CONSTRAINT admin_comments_id_not_null NOT NULL,
    effect_comment_id uuid CONSTRAINT admin_comments_effect_comment_id_not_null NOT NULL,
    user_id uuid CONSTRAINT admin_comments_user_id_not_null NOT NULL,
    content character varying CONSTRAINT admin_comments_content_not_null NOT NULL,
    parent_id uuid,
    is_official boolean DEFAULT false,
    updated_at timestamp(3) with time zone DEFAULT now() CONSTRAINT admin_comments_updated_at_not_null NOT NULL,
    created_at timestamp(3) with time zone DEFAULT now() CONSTRAINT admin_comments_created_at_not_null NOT NULL,
    type public.enum_comments_type DEFAULT 'user'::public.enum_comments_type
);


--
-- Name: comments_rels; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.comments_rels (
    id integer NOT NULL,
    "order" integer,
    parent_id uuid NOT NULL,
    path character varying NOT NULL,
    mangas_id uuid,
    chapters_id uuid
);


--
-- Name: comments_rels_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.comments_rels_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: comments_rels_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.comments_rels_id_seq OWNED BY public.comments_rels.id;


--
-- Name: effect_comments; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.effect_comments (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    tag public.enum_effect_comments_tag DEFAULT 'normal'::public.enum_effect_comments_tag,
    effect public.enum_effect_comments_effect DEFAULT 'none'::public.enum_effect_comments_effect,
    is_pinned boolean DEFAULT false,
    author_id uuid,
    updated_at timestamp(3) with time zone DEFAULT now() NOT NULL,
    created_at timestamp(3) with time zone DEFAULT now() NOT NULL
);


--
-- Name: follows; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.follows (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    manga_id uuid NOT NULL,
    updated_at timestamp(3) with time zone DEFAULT now() NOT NULL,
    created_at timestamp(3) with time zone DEFAULT now() NOT NULL
);


--
-- Name: mangas; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.mangas (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    title character varying NOT NULL,
    slug character varying,
    owner_id uuid NOT NULL,
    cover_id uuid NOT NULL,
    author_id uuid NOT NULL,
    status public.enum_mangas_status,
    published_at timestamp(3) with time zone,
    views numeric DEFAULT 0,
    followers numeric DEFAULT 0,
    latest_chapter_number character varying,
    latest_chapter_slug character varying,
    latest_chapter_updated_at timestamp(3) with time zone,
    updated_at timestamp(3) with time zone DEFAULT now() NOT NULL,
    created_at timestamp(3) with time zone DEFAULT now() NOT NULL,
    rating_avg numeric DEFAULT 0,
    rating_count numeric DEFAULT 0,
    description jsonb,
    age_rating public.enum_mangas_age_rating DEFAULT '13+'::public.enum_mangas_age_rating NOT NULL
);


--
-- Name: mangas_rels; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.mangas_rels (
    id integer NOT NULL,
    "order" integer,
    parent_id uuid NOT NULL,
    path character varying NOT NULL,
    categories_id uuid
);


--
-- Name: mangas_rels_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.mangas_rels_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: mangas_rels_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.mangas_rels_id_seq OWNED BY public.mangas_rels.id;


--
-- Name: media; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.media (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    alt character varying NOT NULL,
    updated_at timestamp(3) with time zone DEFAULT now() NOT NULL,
    created_at timestamp(3) with time zone DEFAULT now() NOT NULL,
    url character varying,
    thumbnail_u_r_l character varying,
    filename character varying,
    mime_type character varying,
    filesize numeric,
    width numeric,
    height numeric,
    focal_x numeric,
    focal_y numeric
);


--
-- Name: payload_kv; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.payload_kv (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    key character varying NOT NULL,
    data jsonb NOT NULL
);


--
-- Name: payload_locked_documents; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.payload_locked_documents (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    global_slug character varying,
    updated_at timestamp(3) with time zone DEFAULT now() NOT NULL,
    created_at timestamp(3) with time zone DEFAULT now() NOT NULL
);


--
-- Name: payload_locked_documents_rels; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.payload_locked_documents_rels (
    id integer NOT NULL,
    "order" integer,
    parent_id uuid NOT NULL,
    path character varying NOT NULL,
    users_id uuid,
    media_id uuid,
    categories_id uuid,
    banners_id uuid,
    authors_id uuid,
    mangas_id uuid,
    chapters_id uuid,
    effect_comments_id uuid,
    comments_id uuid,
    ratings_id uuid,
    follows_id uuid
);


--
-- Name: payload_locked_documents_rels_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.payload_locked_documents_rels_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: payload_locked_documents_rels_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.payload_locked_documents_rels_id_seq OWNED BY public.payload_locked_documents_rels.id;


--
-- Name: payload_migrations; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.payload_migrations (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name character varying,
    batch numeric,
    updated_at timestamp(3) with time zone DEFAULT now() NOT NULL,
    created_at timestamp(3) with time zone DEFAULT now() NOT NULL
);


--
-- Name: payload_preferences; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.payload_preferences (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    key character varying,
    value jsonb,
    updated_at timestamp(3) with time zone DEFAULT now() NOT NULL,
    created_at timestamp(3) with time zone DEFAULT now() NOT NULL
);


--
-- Name: payload_preferences_rels; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.payload_preferences_rels (
    id integer NOT NULL,
    "order" integer,
    parent_id uuid NOT NULL,
    path character varying NOT NULL,
    users_id uuid
);


--
-- Name: payload_preferences_rels_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.payload_preferences_rels_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: payload_preferences_rels_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.payload_preferences_rels_id_seq OWNED BY public.payload_preferences_rels.id;


--
-- Name: ratings; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.ratings (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    manga_id uuid NOT NULL,
    star numeric NOT NULL,
    updated_at timestamp(3) with time zone DEFAULT now() NOT NULL,
    created_at timestamp(3) with time zone DEFAULT now() NOT NULL
);


--
-- Name: users; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.users (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    username character varying NOT NULL,
    updated_at timestamp(3) with time zone DEFAULT now() NOT NULL,
    created_at timestamp(3) with time zone DEFAULT now() NOT NULL,
    email character varying NOT NULL,
    reset_password_token character varying,
    reset_password_expiration timestamp(3) with time zone,
    salt character varying,
    hash character varying,
    login_attempts numeric DEFAULT 0,
    lock_until timestamp(3) with time zone,
    role public.enum_users_role DEFAULT 'user'::public.enum_users_role NOT NULL,
    avatar_id uuid
);


--
-- Name: users_sessions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.users_sessions (
    _order integer NOT NULL,
    _parent_id uuid NOT NULL,
    id character varying NOT NULL,
    created_at timestamp(3) with time zone,
    expires_at timestamp(3) with time zone NOT NULL
);


--
-- Name: chapters_rels id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.chapters_rels ALTER COLUMN id SET DEFAULT nextval('public.chapters_rels_id_seq'::regclass);


--
-- Name: comments_rels id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.comments_rels ALTER COLUMN id SET DEFAULT nextval('public.comments_rels_id_seq'::regclass);


--
-- Name: mangas_rels id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.mangas_rels ALTER COLUMN id SET DEFAULT nextval('public.mangas_rels_id_seq'::regclass);


--
-- Name: payload_locked_documents_rels id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payload_locked_documents_rels ALTER COLUMN id SET DEFAULT nextval('public.payload_locked_documents_rels_id_seq'::regclass);


--
-- Name: payload_preferences_rels id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payload_preferences_rels ALTER COLUMN id SET DEFAULT nextval('public.payload_preferences_rels_id_seq'::regclass);


--
-- Data for Name: authors; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.authors (id, name, slug, bio, avatar_id, updated_at, created_at) FROM stdin;
47fbaa12-4fd4-4938-a0e0-6a6fc3ae4ba3	superman	helo	\N	\N	2026-01-28 04:59:19.605+07	2026-01-28 04:59:19.605+07
\.


--
-- Data for Name: banners; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.banners (id, title, image_id, link, "order", active, updated_at, created_at) FROM stdin;
01d83d67-e300-4c97-a917-22954b5645b2	iu dau	98a0164a-0d43-4337-b03c-2fa7de22157a	\N	0	t	2026-01-20 04:08:27.861+07	2026-01-20 04:08:27.861+07
9a8c5e5e-d3d9-4138-89d6-29c189b05b42	beach	be001771-5d4f-407b-8b65-d5e897b1dbcc	\N	0	t	2026-01-20 04:08:47.94+07	2026-01-20 04:08:47.94+07
\.


--
-- Data for Name: categories; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.categories (id, name, slug, type, parent_id, "order", updated_at, created_at) FROM stdin;
0461d845-6932-4948-8bb9-dcc467634779	Trang chủ	home	menu	\N	0	2026-01-19 03:09:48.584+07	2026-01-19 03:09:48.583+07
82a037d9-06b2-4390-ba22-7a41dfb5bd94	Thể loại	genres	menu	\N	1	2026-01-19 03:09:48.61+07	2026-01-19 03:09:48.61+07
c294c120-7ab4-4015-b0d8-2b7ffbfbc84d	Hành động	action	genre	82a037d9-06b2-4390-ba22-7a41dfb5bd94	0	2026-01-19 03:09:48.628+07	2026-01-19 03:09:48.628+07
4aa31916-3f94-4a1f-a0ef-c07070c27595	Phiêu lưu	adventure	genre	82a037d9-06b2-4390-ba22-7a41dfb5bd94	1	2026-01-19 03:09:48.649+07	2026-01-19 03:09:48.649+07
053472e1-5d7b-4ec7-8f76-33dae1b80ee2	Hài hước	comedy	genre	82a037d9-06b2-4390-ba22-7a41dfb5bd94	2	2026-01-19 03:09:48.666+07	2026-01-19 03:09:48.666+07
35968fc9-3577-4742-a663-cdc1f559f90a	Drama	drama	genre	82a037d9-06b2-4390-ba22-7a41dfb5bd94	3	2026-01-19 03:09:48.68+07	2026-01-19 03:09:48.68+07
9d397556-ed07-42a6-a9b0-a4bfc74c4891	Fantasy	fantasy	genre	82a037d9-06b2-4390-ba22-7a41dfb5bd94	4	2026-01-19 03:09:48.713+07	2026-01-19 03:09:48.713+07
40919f7d-1045-4a9a-92b8-bcc0474ab7ad	Kinh dị	horror	genre	82a037d9-06b2-4390-ba22-7a41dfb5bd94	5	2026-01-19 03:09:48.726+07	2026-01-19 03:09:48.726+07
f519ad37-7611-48d5-8f12-626e6c89ecb7	Tâm lý	psychological	genre	82a037d9-06b2-4390-ba22-7a41dfb5bd94	6	2026-01-19 03:09:48.734+07	2026-01-19 03:09:48.733+07
865e8d4b-b051-4ce9-a713-e6c945087696	Lãng mạn	romance	genre	82a037d9-06b2-4390-ba22-7a41dfb5bd94	7	2026-01-19 03:09:48.747+07	2026-01-19 03:09:48.747+07
369e30f7-6c09-46f9-8743-f8741302ae0b	Khoa học viễn tưởng	sci-fi	genre	82a037d9-06b2-4390-ba22-7a41dfb5bd94	8	2026-01-19 03:09:48.758+07	2026-01-19 03:09:48.758+07
194dd2d3-addf-4c82-9f73-3b0fd7c74989	Đời thường	slice-of-life	genre	82a037d9-06b2-4390-ba22-7a41dfb5bd94	9	2026-01-19 03:09:48.766+07	2026-01-19 03:09:48.765+07
a0a758fd-5fb9-47c7-9d4d-2bdb669d473a	Siêu nhiên	supernatural	genre	82a037d9-06b2-4390-ba22-7a41dfb5bd94	10	2026-01-19 03:09:48.779+07	2026-01-19 03:09:48.779+07
e208a114-9ca9-4b58-aace-9792c91f5a8f	Trinh thám	mystery	genre	82a037d9-06b2-4390-ba22-7a41dfb5bd94	11	2026-01-19 03:09:48.79+07	2026-01-19 03:09:48.79+07
b1b80efc-98cd-482a-97c5-ffa974295185	Võ thuật	martial-arts	genre	82a037d9-06b2-4390-ba22-7a41dfb5bd94	12	2026-01-19 03:09:48.802+07	2026-01-19 03:09:48.802+07
8318532f-2d4b-449a-891f-e9c032ac9cf1	Học đường	school-life	genre	82a037d9-06b2-4390-ba22-7a41dfb5bd94	13	2026-01-19 03:09:48.811+07	2026-01-19 03:09:48.811+07
1d02043a-8852-4d23-89b7-88657263d839	Thể thao	sports	genre	82a037d9-06b2-4390-ba22-7a41dfb5bd94	14	2026-01-19 03:09:48.823+07	2026-01-19 03:09:48.823+07
fe84b3db-a2e9-4926-a976-09778279e604	Mecha	mecha	genre	82a037d9-06b2-4390-ba22-7a41dfb5bd94	15	2026-01-19 03:09:48.836+07	2026-01-19 03:09:48.836+07
1d24ed2f-03ab-4a3e-b563-505415a19da6	Ecchi	ecchi	genre	82a037d9-06b2-4390-ba22-7a41dfb5bd94	16	2026-01-19 03:09:48.845+07	2026-01-19 03:09:48.845+07
2c58a1d7-2578-4d2d-8596-7c520f52ae42	Harem	harem	genre	82a037d9-06b2-4390-ba22-7a41dfb5bd94	17	2026-01-19 03:09:48.86+07	2026-01-19 03:09:48.86+07
4e282dd6-fd70-4d6b-844d-e4e5e22dfbe8	Isekai	isekai	genre	82a037d9-06b2-4390-ba22-7a41dfb5bd94	18	2026-01-19 03:09:48.875+07	2026-01-19 03:09:48.875+07
1c8a8262-b183-4f11-af4f-f1252ac4d4f6	Seinen	seinen	genre	82a037d9-06b2-4390-ba22-7a41dfb5bd94	19	2026-01-19 03:09:48.889+07	2026-01-19 03:09:48.889+07
50ab03fe-6bd4-44e6-af19-db0968881571	Shounen	shounen	genre	82a037d9-06b2-4390-ba22-7a41dfb5bd94	20	2026-01-19 03:09:48.896+07	2026-01-19 03:09:48.896+07
4153be4b-b074-455a-b942-ac0b5966e5ec	Shoujo	shoujo	genre	82a037d9-06b2-4390-ba22-7a41dfb5bd94	21	2026-01-19 03:09:48.907+07	2026-01-19 03:09:48.907+07
15e25ea9-5b6b-4176-b5a3-ebac4206ed6a	Josei	josei	genre	82a037d9-06b2-4390-ba22-7a41dfb5bd94	22	2026-01-19 03:09:48.918+07	2026-01-19 03:09:48.918+07
96c9f09e-1a73-4818-bdbc-e81497a44b00	FanPage	facebook	menu	\N	3	2026-01-19 03:09:48.926+07	2026-01-19 03:09:48.926+07
5c3dbd39-f59a-4eb6-a038-1fa6ea2378ce	Xếp hạng	ranking	menu	\N	4	2026-01-19 03:09:48.934+07	2026-01-19 03:09:48.934+07
16eab909-88fd-469c-8146-4d7f5a33dd37	Top ngày	top-daily	ranking	5c3dbd39-f59a-4eb6-a038-1fa6ea2378ce	0	2026-01-19 03:09:48.939+07	2026-01-19 03:09:48.939+07
05e47ef7-cccf-4929-abd6-dbc68bf356f4	Top tuần	top-weekly	ranking	5c3dbd39-f59a-4eb6-a038-1fa6ea2378ce	1	2026-01-19 03:09:48.95+07	2026-01-19 03:09:48.949+07
4e847f25-2283-4439-abab-442554c91118	Top tháng	top-monthly	ranking	5c3dbd39-f59a-4eb6-a038-1fa6ea2378ce	2	2026-01-19 03:09:48.957+07	2026-01-19 03:09:48.957+07
35c0a586-3a0a-4689-bcbc-4ab14bda49de	Top mọi thời đại	top-all-time	ranking	5c3dbd39-f59a-4eb6-a038-1fa6ea2378ce	3	2026-01-19 03:09:48.967+07	2026-01-19 03:09:48.967+07
1ea59911-3860-4931-942d-c8f6e1a99b4f	Khác	others	menu	\N	5	2026-01-19 03:09:48.974+07	2026-01-19 03:09:48.974+07
497e609c-f126-42ad-837d-3e0140d551b2	Truyện mới	new-release	other	1ea59911-3860-4931-942d-c8f6e1a99b4f	0	2026-01-19 03:09:48.985+07	2026-01-19 03:09:48.985+07
8f18d91d-f7b6-4f41-81e7-ea517748e5e7	Mới cập nhật	recent-updated	other	1ea59911-3860-4931-942d-c8f6e1a99b4f	1	2026-01-19 03:09:48.992+07	2026-01-19 03:09:48.992+07
a7793fd2-aea0-4b5e-810c-1c6ddb3ee49a	Truyện hot	trending	other	1ea59911-3860-4931-942d-c8f6e1a99b4f	2	2026-01-19 03:09:49.005+07	2026-01-19 03:09:49.004+07
573ccb7a-5714-41e8-8ea8-2c46709c2500	Được yêu thích	most-favorite	other	1ea59911-3860-4931-942d-c8f6e1a99b4f	3	2026-01-19 03:09:49.016+07	2026-01-19 03:09:49.016+07
59da3788-e5c7-4f32-bff7-7a45d47b17b0	Xem nhiều	most-viewed	other	1ea59911-3860-4931-942d-c8f6e1a99b4f	4	2026-01-19 03:09:49.023+07	2026-01-19 03:09:49.023+07
7738fb94-2123-4c1a-831c-57b3a4330d89	Đánh giá cao	top-rated	other	1ea59911-3860-4931-942d-c8f6e1a99b4f	5	2026-01-19 03:09:49.035+07	2026-01-19 03:09:49.035+07
bb712cbe-61a8-4c45-8e34-c35e3774fb82	Truyện ngẫu nhiên	random	other	1ea59911-3860-4931-942d-c8f6e1a99b4f	6	2026-01-19 03:09:49.043+07	2026-01-19 03:09:49.043+07
\.


--
-- Data for Name: chapters; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.chapters (id, manga_id, title, chapter_number, slug, views, status, created_by_id, published_at, updated_at, created_at) FROM stdin;
98e76af3-448c-4a25-9b4e-e45645be5146	de80bf66-fb58-42c9-b52b-46159a8170c6	chap 1	1	chapter-1	0	published	\N	2026-02-13 12:18:50.252+07	2026-02-13 12:18:50.279+07	2026-02-13 12:18:50.278+07
21b12e50-03d0-4649-a80a-2b8ea7811fc3	de80bf66-fb58-42c9-b52b-46159a8170c6	Chapter 2	2	chapter-2	0	published	\N	2026-02-13 12:38:49.076+07	2026-02-13 12:38:49.085+07	2026-02-13 12:38:49.084+07
\.


--
-- Data for Name: chapters_pages; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.chapters_pages (_order, _parent_id, id, image_id, "order") FROM stdin;
1	98e76af3-448c-4a25-9b4e-e45645be5146	698eb43a0d97dc2312f1b66b	4a26246b-4132-4a7d-b517-5bac77a9b901	1
2	98e76af3-448c-4a25-9b4e-e45645be5146	698eb43a0d97dc2312f1b66c	457f5f4e-52ec-49dd-9f90-d4972c99469b	2
3	98e76af3-448c-4a25-9b4e-e45645be5146	698eb43a0d97dc2312f1b66d	21f4bde8-e113-4bd4-aa39-b2514671174d	3
4	98e76af3-448c-4a25-9b4e-e45645be5146	698eb43a0d97dc2312f1b66e	ffa5bf8c-d19f-444e-b852-4eb3b486147a	4
5	98e76af3-448c-4a25-9b4e-e45645be5146	698eb43a0d97dc2312f1b66f	29b05973-f76a-4bf0-ade9-7b0f7a2d8897	5
6	98e76af3-448c-4a25-9b4e-e45645be5146	698eb43a0d97dc2312f1b670	79a082fd-978f-4481-9734-11bca64cd8a6	6
1	21b12e50-03d0-4649-a80a-2b8ea7811fc3	698eb8e9dddeb9378f138511	dd13741b-d790-4966-b57a-720482df4df9	1
2	21b12e50-03d0-4649-a80a-2b8ea7811fc3	698eb8e9dddeb9378f138512	19e6c550-5be1-48af-a356-37864aad9c5f	2
3	21b12e50-03d0-4649-a80a-2b8ea7811fc3	698eb8e9dddeb9378f138513	0177ad59-91a1-4a4e-855d-ba25600d0edc	3
4	21b12e50-03d0-4649-a80a-2b8ea7811fc3	698eb8e9dddeb9378f138514	fcb8aa69-b55f-4082-8599-a69ad8a4b7c5	4
\.


--
-- Data for Name: chapters_rels; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.chapters_rels (id, "order", parent_id, path, media_id) FROM stdin;
\.


--
-- Data for Name: comments; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.comments (id, effect_comment_id, user_id, content, parent_id, is_official, updated_at, created_at, type) FROM stdin;
3db15764-cb9d-4621-b383-d3f503c99911	749f60b7-5a0a-488f-977f-731fedfe1469	8eeae12e-9c50-40b9-9c92-9821a1605d40	Chào Mừng MN đến với thế giới Alga của chings tôi \n\n	\N	t	2026-02-13 12:56:57.94+07	2026-02-13 12:56:57.94+07	superadmin
\.


--
-- Data for Name: comments_rels; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.comments_rels (id, "order", parent_id, path, mangas_id, chapters_id) FROM stdin;
\.


--
-- Data for Name: effect_comments; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.effect_comments (id, tag, effect, is_pinned, author_id, updated_at, created_at) FROM stdin;
749f60b7-5a0a-488f-977f-731fedfe1469	normal	glow	t	8eeae12e-9c50-40b9-9c92-9821a1605d40	2026-01-23 20:21:17.7+07	2026-01-23 20:21:17.699+07
98da6b46-557b-4a56-8174-74da4d6fad5d	important	confetti	t	8eeae12e-9c50-40b9-9c92-9821a1605d40	2026-01-27 02:55:04.984+07	2026-01-27 02:55:04.984+07
1fa3f844-3003-4ffd-9e68-78ff3b8e09f5	release	none	t	8eeae12e-9c50-40b9-9c92-9821a1605d40	2026-01-27 02:55:22.99+07	2026-01-27 02:55:22.99+07
\.


--
-- Data for Name: follows; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.follows (id, user_id, manga_id, updated_at, created_at) FROM stdin;
\.


--
-- Data for Name: mangas; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.mangas (id, title, slug, owner_id, cover_id, author_id, status, published_at, views, followers, latest_chapter_number, latest_chapter_slug, latest_chapter_updated_at, updated_at, created_at, rating_avg, rating_count, description, age_rating) FROM stdin;
de80bf66-fb58-42c9-b52b-46159a8170c6	SHOW ME YOUR TEETH	show-me-your-teeth	8eeae12e-9c50-40b9-9c92-9821a1605d40	24dc3133-057e-49f4-a70e-e59e99e0725e	47fbaa12-4fd4-4938-a0e0-6a6fc3ae4ba3	Đang cập nhập	\N	1	0	3	chapter-3	2026-02-13 12:40:57.441+07	2026-02-13 12:40:57.457+07	2026-02-13 12:18:25.986+07	4	1	\N	18+
150b6882-9663-4d5b-ba8a-70e8977302b5	 Đồ Cầm Thú	djo-cam-thu	8eeae12e-9c50-40b9-9c92-9821a1605d40	97b9f2f0-911a-474f-b3a4-a8c14e773340	47fbaa12-4fd4-4938-a0e0-6a6fc3ae4ba3	Đang cập nhập	\N	11	0	\N	\N	\N	2026-02-13 12:55:50.258+07	2026-02-13 12:55:40.658+07	0	0	{"root": {"type": "root", "format": "", "indent": 0, "version": 1, "children": [{"type": "paragraph", "format": "justify", "indent": 0, "version": 1, "children": [{"mode": "normal", "text": "Thấy đối phương run rẩy chỉ vì một cái chạm nhẹ nơi đầu ngón tay mảnh mai của mình, một khoái cảm rùng mình dần trào khiến cô muốn trêu chọc thêm một chút.", "type": "text", "style": "", "detail": 0, "format": 0, "version": 1}], "direction": null, "textStyle": "", "textFormat": 0}, {"type": "paragraph", "format": "justify", "indent": 0, "version": 1, "children": [{"mode": "normal", "text": "Nhưng cô chẳng hề hay biết trò đùa đó sẽ dẫn đến hậu quả gì.", "type": "text", "style": "", "detail": 0, "format": 0, "version": 1}], "direction": null, "textStyle": "", "textFormat": 0}, {"type": "paragraph", "format": "justify", "indent": 0, "version": 1, "children": [{"mode": "normal", "text": "“Tôi muốn chạm vào cả chỗ này cơ”", "type": "text", "style": "", "detail": 0, "format": 0, "version": 1}], "direction": null, "textStyle": "", "textFormat": 0}, {"type": "paragraph", "format": "justify", "indent": 0, "version": 1, "children": [{"mode": "normal", "text": "“Hả?”", "type": "text", "style": "", "detail": 0, "format": 0, "version": 1}], "direction": null, "textStyle": "", "textFormat": 0}, {"type": "paragraph", "format": "justify", "indent": 0, "version": 1, "children": [{"mode": "normal", "text": "Cứ tưởng cô không biết gì, nhưng hóa ra cô là một con thú non chính hiệu.", "type": "text", "style": "", "detail": 0, "format": 0, "version": 1}], "direction": null, "textStyle": "", "textFormat": 0}], "direction": null}}	13+
\.


--
-- Data for Name: mangas_rels; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.mangas_rels (id, "order", parent_id, path, categories_id) FROM stdin;
212	1	150b6882-9663-4d5b-ba8a-70e8977302b5	genres	1d24ed2f-03ab-4a3e-b563-505415a19da6
213	2	150b6882-9663-4d5b-ba8a-70e8977302b5	genres	2c58a1d7-2578-4d2d-8596-7c520f52ae42
214	3	150b6882-9663-4d5b-ba8a-70e8977302b5	genres	fe84b3db-a2e9-4926-a976-09778279e604
207	1	de80bf66-fb58-42c9-b52b-46159a8170c6	genres	1d24ed2f-03ab-4a3e-b563-505415a19da6
208	2	de80bf66-fb58-42c9-b52b-46159a8170c6	genres	194dd2d3-addf-4c82-9f73-3b0fd7c74989
\.


--
-- Data for Name: media; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.media (id, alt, updated_at, created_at, url, thumbnail_u_r_l, filename, mime_type, filesize, width, height, focal_x, focal_y) FROM stdin;
35ece6d9-3549-4615-8d38-07f82fd5c0e5	serty	2026-01-19 03:11:36.397+07	2026-01-19 03:11:36.397+07	\N	\N	login.jpg	image/jpeg	92317	736	993	50	50
40fec437-2e14-49d7-a308-530b700e2ef2	vvfd	2026-01-19 03:45:34.081+07	2026-01-19 03:45:34.08+07	\N	\N	card1-1.jpg	image/jpeg	118418	736	1040	50	50
be001771-5d4f-407b-8b65-d5e897b1dbcc	w	2026-01-20 04:07:57.938+07	2026-01-20 04:07:57.938+07	\N	\N	backgroun2-3.jpg	image/jpeg	85646	1199	539	50	50
98a0164a-0d43-4337-b03c-2fa7de22157a	party	2026-01-20 04:08:11.501+07	2026-01-20 04:08:11.501+07	\N	\N	backgorun-3.jpg	image/jpeg	163813	1200	811	50	50
fff8813e-6948-41cd-9ddd-3aaceb836884	chap 1	2026-02-09 23:15:51.606+07	2026-02-09 23:15:51.606+07	\N	\N	1.jpg	image/jpeg	197037	1230	1324	50	50
8b57a6cb-dc8e-4e86-a4ae-3ac46d0a2813	chap 1	2026-02-09 23:16:01.001+07	2026-02-09 23:16:01.001+07	\N	\N	2.jpeg	image/jpeg	43265	640	419	50	50
801e4edf-322c-4daf-b719-cfb91ee617e6	chap 1	2026-02-09 23:16:01.38+07	2026-02-09 23:16:01.38+07	\N	\N	3.jpg	image/jpeg	4209765	1920	18977	50	50
9d93c4be-bf23-4382-9efd-239b0b76eae0	d	2026-02-09 23:27:38.692+07	2026-02-09 23:27:38.692+07	\N	\N	4.jpg	image/jpeg	4209765	1920	18977	50	50
e062aea4-ce52-42f7-b28e-40905274d4ac	d	2026-02-09 23:27:39.256+07	2026-02-09 23:27:39.256+07	\N	\N	5.jpg	image/jpeg	4791704	1920	18977	50	50
fc6c2aed-786d-4154-938a-b21e7df560eb	1	2026-02-09 23:28:34.113+07	2026-02-09 23:28:34.113+07	\N	\N	decor.png	image/png	257620	800	347	50	50
2f136efb-fc0c-4288-89a9-7d1d8bda69b7	6.jpg	2026-02-13 12:14:07.328+07	2026-02-13 12:14:07.325+07	\N	\N	6.jpg	image/jpeg	1085547	720	22840	50	50
ba8913e2-f69a-4ac7-b847-6836d238eb95	5.jpg	2026-02-13 12:14:07.333+07	2026-02-13 12:14:07.333+07	\N	\N	5-1.jpg	image/jpeg	781665	720	17407	50	50
1ea4bbc4-b1c5-4dfc-a3ff-afacae9a4c54	3.jpg	2026-02-13 12:14:07.335+07	2026-02-13 12:14:07.335+07	\N	\N	3-1.jpg	image/jpeg	920209	720	18166	50	50
f77dcfa0-9583-4462-bd11-137c43ce902b	1.jpg	2026-02-13 12:14:07.337+07	2026-02-13 12:14:07.337+07	\N	\N	1-1.jpg	image/jpeg	995939	720	19548	50	50
087d97aa-44a0-42db-95a3-dab5a327488a	4.jpg	2026-02-13 12:14:07.339+07	2026-02-13 12:14:07.339+07	\N	\N	4-1.jpg	image/jpeg	920209	720	18166	50	50
265014f9-8be2-4484-88c8-b6800c1aebaf	2.jpg	2026-02-13 12:14:07.341+07	2026-02-13 12:14:07.341+07	\N	\N	2.jpg	image/jpeg	801792	720	17565	50	50
24dc3133-057e-49f4-a70e-e59e99e0725e	he	2026-02-13 12:17:42.608+07	2026-02-13 12:17:42.606+07	\N	\N	show-me-cover.webp	image/webp	63330	720	970	50	50
79a082fd-978f-4481-9734-11bca64cd8a6	6.jpg	2026-02-13 12:18:50.202+07	2026-02-13 12:18:50.199+07	\N	\N	6-1.jpg	image/jpeg	1085547	720	22840	50	50
457f5f4e-52ec-49dd-9f90-d4972c99469b	2.jpg	2026-02-13 12:18:50.208+07	2026-02-13 12:18:50.208+07	\N	\N	2-1.jpg	image/jpeg	801792	720	17565	50	50
29b05973-f76a-4bf0-ade9-7b0f7a2d8897	5.jpg	2026-02-13 12:18:50.21+07	2026-02-13 12:18:50.21+07	\N	\N	5-2.jpg	image/jpeg	781665	720	17407	50	50
4a26246b-4132-4a7d-b517-5bac77a9b901	1.jpg	2026-02-13 12:18:50.213+07	2026-02-13 12:18:50.212+07	\N	\N	1-2.jpg	image/jpeg	995939	720	19548	50	50
ffa5bf8c-d19f-444e-b852-4eb3b486147a	4.jpg	2026-02-13 12:18:50.215+07	2026-02-13 12:18:50.215+07	\N	\N	4-2.jpg	image/jpeg	920209	720	18166	50	50
21f4bde8-e113-4bd4-aa39-b2514671174d	3.jpg	2026-02-13 12:18:50.216+07	2026-02-13 12:18:50.216+07	\N	\N	3-2.jpg	image/jpeg	920209	720	18166	50	50
fcb8aa69-b55f-4082-8599-a69ad8a4b7c5	2-4	2026-02-13 12:38:49.049+07	2026-02-13 12:38:49.047+07	\N	\N	4-3.jpg	image/jpeg	1000385	720	24740	50	50
dd13741b-d790-4966-b57a-720482df4df9	2-1	2026-02-13 12:38:49.052+07	2026-02-13 12:38:49.052+07	\N	\N	1-3.jpg	image/jpeg	1067757	720	18864	50	50
0177ad59-91a1-4a4e-855d-ba25600d0edc	2-3	2026-02-13 12:38:49.059+07	2026-02-13 12:38:49.059+07	\N	\N	3-3.jpg	image/jpeg	946415	720	17033	50	50
19e6c550-5be1-48af-a356-37864aad9c5f	2-2	2026-02-13 12:38:49.06+07	2026-02-13 12:38:49.06+07	\N	\N	2-2.jpg	image/jpeg	799110	720	18125	50	50
97b9f2f0-911a-474f-b3a4-a8c14e773340	s	2026-02-13 12:54:48.877+07	2026-02-13 12:54:48.877+07	\N	\N	DO-CAM-THU.webp	image/webp	88818	720	970	50	50
\.


--
-- Data for Name: payload_kv; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.payload_kv (id, key, data) FROM stdin;
\.


--
-- Data for Name: payload_locked_documents; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.payload_locked_documents (id, global_slug, updated_at, created_at) FROM stdin;
adde74c3-7238-4812-8d17-5a5df4f72287	\N	2026-01-28 06:01:25.257+07	2026-01-28 06:01:25.257+07
\.


--
-- Data for Name: payload_locked_documents_rels; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.payload_locked_documents_rels (id, "order", parent_id, path, users_id, media_id, categories_id, banners_id, authors_id, mangas_id, chapters_id, effect_comments_id, comments_id, ratings_id, follows_id) FROM stdin;
\.


--
-- Data for Name: payload_migrations; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.payload_migrations (id, name, batch, updated_at, created_at) FROM stdin;
d10b50c6-7d1b-4523-a972-8bac4c9a2b3f	dev	-1	2026-02-13 12:38:48.831+07	2026-01-19 03:09:48.511+07
\.


--
-- Data for Name: payload_preferences; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.payload_preferences (id, key, value, updated_at, created_at) FROM stdin;
9a911ac2-4555-4cf1-9d3f-dd50c5ec1765	collection-media	{"editViewType": "default"}	2026-01-19 03:11:25.217+07	2026-01-19 03:11:23.868+07
8b57fa1d-4f99-4ef9-9289-931400ff8701	collection-chapters	{"limit": 10, "editViewType": "default"}	2026-01-19 15:33:34.54+07	2026-01-19 03:10:53.867+07
6925fc5b-624f-46f2-a099-bfdc6d9040b4	collection-ratings	{"limit": 10, "editViewType": "default"}	2026-01-19 15:39:52.962+07	2026-01-19 15:28:34.065+07
67e8805e-35d9-4fa2-ab35-f5230e2de336	collection-banners	{"editViewType": "default"}	2026-01-20 04:07:48.07+07	2026-01-19 15:34:21.911+07
561293ad-544f-43a9-b71f-64e202ea9295	collection-users	{"limit": 10, "editViewType": "default"}	2026-01-20 04:40:47.003+07	2026-01-19 15:34:02.492+07
206146b7-5c53-4613-b511-fab7a6d2a694	collection-admin-comments	{"limit": 10, "editViewType": "default"}	2026-01-22 21:59:52.772+07	2026-01-22 21:58:37.689+07
38b265f5-0e3e-4572-a2e1-6ce5ec52ec54	collection-comments	{"limit": 10, "editViewType": "default"}	2026-01-23 20:08:13.849+07	2026-01-23 19:48:58.1+07
987bb91a-3b03-490e-a216-6357558df6d2	collection-effect-comments	{"limit": 10, "editViewType": "default"}	2026-01-25 05:30:42.576+07	2026-01-19 15:54:52.317+07
136d5858-830c-48a6-8367-f0986f4cc15f	collection-authors	{"limit": 10, "editViewType": "default"}	2026-01-28 04:55:18.195+07	2026-01-19 03:12:08.007+07
615c754a-4540-4786-95e6-50d3b003d272	collection-ratings	{"limit": 10, "editViewType": "default"}	2026-01-28 05:57:04.395+07	2026-01-28 05:46:45.614+07
d16640e0-8738-4a3e-a416-716868136bca	collection-users	{"editViewType": "default"}	2026-01-28 05:59:28.402+07	2026-01-28 05:59:27.157+07
25366fb8-3645-4d2d-9f61-94682529f6b3	collection-ratings	{"limit": 10, "editViewType": "default"}	2026-01-28 06:00:28.29+07	2026-01-28 06:00:09.889+07
98793fa0-4c0a-4b69-8474-c58891f15460	collection-chapters	{}	2026-01-28 06:00:44.632+07	2026-01-28 06:00:44.632+07
ea49bb86-9699-432e-b03a-c6227ed67da3	collection-mangas	{"editViewType": "default"}	2026-01-28 06:00:46.88+07	2026-01-28 06:00:45.484+07
27513199-3043-44e8-bb37-f503d384d466	collection-comments	{}	2026-01-28 06:00:53.417+07	2026-01-28 06:00:53.417+07
e3853d61-490e-4089-ae73-f8863d99654e	collection-effect-comments	{}	2026-01-28 06:01:00.072+07	2026-01-28 06:01:00.072+07
c4a06c5d-983e-487c-b8e2-2a9631bb42a3	nav	{"open": true}	2026-01-28 06:13:13.489+07	2026-01-28 06:07:10.445+07
84d8f437-9c54-4b28-8f2e-5aa3de940517	collection-comments	{"limit": 10, "editViewType": "default"}	2026-02-06 22:18:34.962+07	2026-01-28 05:51:24.248+07
81abc956-ba53-4bb9-9d4b-b96e7a04d368	collection-chapters	{"limit": 10, "editViewType": "default"}	2026-02-08 13:45:39.144+07	2026-01-28 06:02:41.037+07
9842670e-68ba-418f-b44b-29a5ab67b1b9	collection-effect-comments	{}	2026-02-08 13:48:12.743+07	2026-02-08 13:48:12.743+07
b298bb01-fcfe-49e7-8444-7f969779d5e2	collection-follows	{"limit": 10}	2026-02-08 13:48:51.315+07	2026-02-08 13:48:45.334+07
c125064a-2bcd-49e2-9802-f5bb80b26d42	collection-media	{"editViewType": "default"}	2026-02-09 23:09:52.935+07	2026-02-08 13:45:50.171+07
4f8cd02d-097c-4f91-bd2a-acc3b189788a	collection-mangas	{"limit": 10, "columns": [{"active": true, "accessor": "title"}, {"active": true, "accessor": "slug"}, {"active": true, "accessor": "description"}, {"active": true, "accessor": "owner"}, {"active": false, "accessor": "id"}, {"active": false, "accessor": "genres"}, {"active": false, "accessor": "rating.avg"}, {"active": false, "accessor": "rating.count"}, {"active": false, "accessor": "ageRating"}, {"active": false, "accessor": "cover"}, {"active": false, "accessor": "author"}, {"active": false, "accessor": "status"}, {"active": false, "accessor": "publishedAt"}, {"active": false, "accessor": "views"}, {"active": false, "accessor": "followers"}, {"active": false, "accessor": "latestChapter.number"}, {"active": false, "accessor": "latestChapter.slug"}, {"active": false, "accessor": "latestChapter.updatedAt"}, {"active": false, "accessor": "updatedAt"}, {"active": false, "accessor": "createdAt"}], "editViewType": "default"}	2026-02-09 23:26:19.444+07	2026-01-28 05:51:14.784+07
6ce7e8e5-e1d7-45da-a3e4-b2375d4e4d58	collection-follows	{}	2026-02-10 18:22:54.805+07	2026-02-10 18:22:54.805+07
872de3a8-0891-4459-b06e-9936f838e933	nav	{"open": true, "groups": {"Collections": {"open": true}}}	2026-02-10 18:23:37.418+07	2026-01-19 15:33:11.781+07
6d45eb82-f948-4f66-8de5-6e7f0f974b55	collection-categories	{"limit": 100, "editViewType": "default"}	2026-02-10 18:25:53.744+07	2026-01-19 04:01:04.255+07
ce3c5151-2e77-4107-ade3-8db5648c4e5f	collection-mangas	{"limit": 10, "editViewType": "default"}	2026-02-13 11:52:47.619+07	2026-01-19 03:10:59.384+07
\.


--
-- Data for Name: payload_preferences_rels; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.payload_preferences_rels (id, "order", parent_id, path, users_id) FROM stdin;
81	\N	81abc956-ba53-4bb9-9d4b-b96e7a04d368	user	6916d1b6-eb4b-453d-8742-923c4b614720
5	\N	9a911ac2-4555-4cf1-9d3f-dd50c5ec1765	user	8eeae12e-9c50-40b9-9c92-9821a1605d40
84	\N	9842670e-68ba-418f-b44b-29a5ab67b1b9	user	6916d1b6-eb4b-453d-8742-923c4b614720
86	\N	b298bb01-fcfe-49e7-8444-7f969779d5e2	user	6916d1b6-eb4b-453d-8742-923c4b614720
88	\N	c125064a-2bcd-49e2-9802-f5bb80b26d42	user	6916d1b6-eb4b-453d-8742-923c4b614720
90	\N	4f8cd02d-097c-4f91-bd2a-acc3b189788a	user	6916d1b6-eb4b-453d-8742-923c4b614720
16	\N	8b57fa1d-4f99-4ef9-9289-931400ff8701	user	8eeae12e-9c50-40b9-9c92-9821a1605d40
93	\N	6ce7e8e5-e1d7-45da-a3e4-b2375d4e4d58	user	8eeae12e-9c50-40b9-9c92-9821a1605d40
95	\N	872de3a8-0891-4459-b06e-9936f838e933	user	8eeae12e-9c50-40b9-9c92-9821a1605d40
98	\N	6d45eb82-f948-4f66-8de5-6e7f0f974b55	user	8eeae12e-9c50-40b9-9c92-9821a1605d40
25	\N	6925fc5b-624f-46f2-a099-bfdc6d9040b4	user	8eeae12e-9c50-40b9-9c92-9821a1605d40
100	\N	ce3c5151-2e77-4107-ade3-8db5648c4e5f	user	8eeae12e-9c50-40b9-9c92-9821a1605d40
27	\N	67e8805e-35d9-4fa2-ab35-f5230e2de336	user	8eeae12e-9c50-40b9-9c92-9821a1605d40
28	\N	561293ad-544f-43a9-b71f-64e202ea9295	user	8eeae12e-9c50-40b9-9c92-9821a1605d40
36	\N	206146b7-5c53-4613-b511-fab7a6d2a694	user	8eeae12e-9c50-40b9-9c92-9821a1605d40
39	\N	38b265f5-0e3e-4572-a2e1-6ce5ec52ec54	user	8eeae12e-9c50-40b9-9c92-9821a1605d40
42	\N	987bb91a-3b03-490e-a216-6357558df6d2	user	8eeae12e-9c50-40b9-9c92-9821a1605d40
45	\N	136d5858-830c-48a6-8367-f0986f4cc15f	user	8eeae12e-9c50-40b9-9c92-9821a1605d40
57	\N	615c754a-4540-4786-95e6-50d3b003d272	user	6916d1b6-eb4b-453d-8742-923c4b614720
59	\N	d16640e0-8738-4a3e-a416-716868136bca	user	6916d1b6-eb4b-453d-8742-923c4b614720
62	\N	25366fb8-3645-4d2d-9f61-94682529f6b3	user	adda9aed-80d3-4074-a99c-fb164dafc946
63	\N	98793fa0-4c0a-4b69-8474-c58891f15460	user	adda9aed-80d3-4074-a99c-fb164dafc946
65	\N	ea49bb86-9699-432e-b03a-c6227ed67da3	user	adda9aed-80d3-4074-a99c-fb164dafc946
66	\N	27513199-3043-44e8-bb37-f503d384d466	user	adda9aed-80d3-4074-a99c-fb164dafc946
67	\N	e3853d61-490e-4089-ae73-f8863d99654e	user	adda9aed-80d3-4074-a99c-fb164dafc946
72	\N	c4a06c5d-983e-487c-b8e2-2a9631bb42a3	user	6916d1b6-eb4b-453d-8742-923c4b614720
79	\N	84d8f437-9c54-4b28-8f2e-5aa3de940517	user	6916d1b6-eb4b-453d-8742-923c4b614720
\.


--
-- Data for Name: ratings; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.ratings (id, user_id, manga_id, star, updated_at, created_at) FROM stdin;
77953d42-562f-4e47-a0c3-e3e1c113ab3a	8eeae12e-9c50-40b9-9c92-9821a1605d40	de80bf66-fb58-42c9-b52b-46159a8170c6	4	2026-02-13 12:19:30.541+07	2026-02-13 12:19:30.541+07
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.users (id, username, updated_at, created_at, email, reset_password_token, reset_password_expiration, salt, hash, login_attempts, lock_until, role, avatar_id) FROM stdin;
adda9aed-80d3-4074-a99c-fb164dafc946	ab	2026-01-28 05:59:46.911+07	2026-01-28 05:59:46.911+07	anh@gmail.com	\N	\N	67ec38ba8ce923e2b9feb8c3d08a38667dfaa6b66e3015a41ac65ca5801e1289	70269780cd99804d0d4dc2adb636153273c1c3b2b5d3217361767bd25c5f5234b2c734f20eadcb0c5f38b00d3e1f02e43bb06980dae52d15e58abade47898550979a782a1d2aca3b5bd711494b97f2cc6e7b68e4709aa089f4d2884d15dae92dd813aa64b265cd51190843b8f1c32ce76421f8058213044917bad2cac4a8a473e1b8ae632ec14ca3da9727e2cd585ca552fd7936c26605d3963992b5c06a5045d7e59b59d1d1beba3277a0794fd913202eeaddfc825cf9c4641b84f19353de79f1699e9dae1afb2c973a708a43870c73af92b27241609baa7cc0bade14ec8e6d24832fbd4bc5f5a8fa7e11bb8501449545cd71e73507e4d253e0fbcf21687ba31ba78bbfa710fff0863823a5fccaa33a71c857788fa344e8b902bbb3c4ca2e552c8d9f64f554e779c6492ba9693f8839c630a9ef478b1fb26320389c3f3f1f396c80068152a8a6555a04e054f1f1b34728c99a530b6b85f4b4f930f6bec551f7b23cd5d1de5c1e3d6b341ab42e9486cf5c3a83472e32026dec17fb6c61e0e7de3de026d2ffdd3df582f1b9d5ac8a5591fb09661020bdeb0a761f308359318c91558959d83d29fdea9d33621189850016efb20b8835728904fc57b3e16e3c134e24522f085058f6e86b1543e645acf5799721d377ca52e1a3a70ce09236a860f1a7ea67c3e22ead5db0b73b484d4432dbe8259eebb1fe7a5f77733538a6e11e30	0	\N	user	\N
1e48877e-23b8-49a4-960d-afdf19a67f8d	hithre	2026-02-07 15:30:19.214+07	2026-02-07 15:30:19.214+07	boss12@gmail.com	\N	\N	9695aae70bf9226be143f5951214380c45b52fe7fd57d0494ca905665a767808	7dc8456aecdc6e1ef8087db58d1d7649cde326440b6dca163e54a14c626f45daf632082e602a774791c2f4a7c629cd5319dbc37e887b53dd65fe79c44b913b209b0933c41d2981c2a62b9ac017f3c4fd223fe2fdfab60e08521ec7f8736108d4fa82215934108836355349287829c9daa7ac495bcc4f67bf7f83628c8005cbb5175bebf2a827512bda6a0db7b71d329f338aba1ff6023dd443fae6790ee5fe98497ecbfb131a4ef278a6d0740dc8e4dcf14b10b2588038d1025d4ed1032879b32c15263b85d818ad927c7a265424b5cc0bfd33173400aa8144dcfe47afcbdb4ec16025311f88fa9adec4f839f1d941be571dc9979677db21be8835a5b579fb0191d504cf4ddcef8b305ae3973346d42b1050c09b9e3e19ae20a09864905d8651fd6b54030e30d43ec55418e8128978d8c293280be0c87656e37867910aae7fe5307bbdca063ec74a53016b66efb4d53ff5f75b197c305744f00e02b75697dc777f86a1dbea509d3309d37fa92d60d2cbe674f945ae2cbc2a0c2c3d916648397d5d09b36de8121b4462046cc120f6db94f3011fc4483d1089d09aa36a81bf903161a673c58acbd848abfb241ec6970850c16850e87020cdd93e67de2dcdee67d5e8b24b36a865651862d5db9b550c692b7645af6ef45a1267e5293251662bc1ad26f5cbcf3d165289c0de72b32349b662ea3b422fcd06d7834d7e4aef83479966	0	\N	user	\N
795e508e-82e2-4a4e-af56-19cb0b481a00	Boss	2026-02-07 15:32:38.713+07	2026-02-07 15:29:10.831+07	boss@gmail.com	\N	\N	536f4335680740f8e7183403f5af1c34895c8232e80bd642794536cbb9de5c0e	09145a11c4dab18cfa7ec8cfcdfb9c233888d6aa464527731be97e1e281151a2505f828e0f4b427e01ed12b4e1c81e1c427afe171e3f838a10a4a48ac9d0b2db72c91e5b4ce18aa2cbc94ce3e7dc3c9f04c3f870ce9b66faa1d66578fa2c1e2452660b4facb779db062e7cad2621e797b0633f3823b116d802ddaf024d474def6b0f98c3557c85338c91e71a578df38001f57caa26a176bcf5f8dbc65b89dd52bcc60217be6ffd15c1c04cff12c6c76bccdc4fc2a4ad45837fa89b4b87feb815bb2f834d256868cf1b46498212ed803fff39764017e13b764dfed98b373afe9480eec5b6b65672f330eceb7c67b0217597cb57e63b4bd6af8d700faec91b303456ea4527b376d6a8143e9539e65c8f3c93260536332e5b37afde160ff87b6d7c30288b22872b8c67434c628fe0a24968b44f8eaa2f2146dd5ed37c55a321e16a2b48aa0c95a3cd6e48c719d44e3ec7224aaff2572a3762c13bb7abadf26984d4b43ebfd27c3d1eee72882b7c299270dcd1eea554142f1d15236db9b0eb61f0b632da2b2d0259f10da562b192beac00d54b4bf49140e5c4b893c68bbcba0dc80e47de1406c28698f719c525a11cb1c07f1eaadf4a697511a775fd88b9df0cd2c810cd655cb881ab382cc6f2fff206f88b831cfa1cac42d25f6a6da6cb5abf436a7b88a28e0d1ac0250e33fb0d9fbb7e884143ce1265ae8000849ac4e869f89232	0	\N	user	be001771-5d4f-407b-8b65-d5e897b1dbcc
6916d1b6-eb4b-453d-8742-923c4b614720	Helllo	2026-02-08 10:02:29.452+07	2026-01-28 05:21:55.275+07	hello@gmail.com	\N	\N	71250ce9c77e03b5a25ae6381d9ff912babd22ff1c87b9e7f1d6e8d6f4b7bf06	9ba6c9d358f92fddaa514d70fe3382c8632c8bfee4afb881e747180e48beb94af4d2c907ee0c4b33c23852a3c3d425865ddbf18f38b97037b9f63f59f346f643f994d863d902e84d1af640d62480d28b157896d290f2591bc882966a7f6831ac05bcf07e3dc9122747b0562c791db864e104dd10577f650a3fee8ac8e3d5a0360905626c3d7bbd62cdc6b91a7555a552e577cf19bcf255f8d708a497e21d27eabed5ee55e1584e02ccd9d06dacc6e3b1a21100eb865a388d0d4f3f46dbbf44bdd64e5e9a83ee4faecf7d92881a9f3b330e7f0e29761f01c9a51d6a35c2441ece1e2ffca0b6f731f51b3437a73a6a8678899518d67d6868cd0d277fa5d97274ad9afc4c7ba0df24da69ec6537d1396e2270298766c96a96bbbd2aaea587a80cb5a41afb28bcb304aa381a72895fabad4b015cebd91d92d94c84bb5df20422bba8759f32843f9a88cc75f5bc19843c8eb2940306bb966d597ac6cf6de17c260974bd6e439d08b9f7bcf82b4821ec3f231a9291e8da30b284dda3eb94fc6adee5901716a4bd1f87db454b9981d97e4745225c44e3f28e0f84a957bcb3b076c35547e1f757cafe35f7354511f09a3c396ead28837b12e87a4d5ded254c610d47b938bc7f471b37bbd6ef5da3c080aa9aad1799b6a0c56bbd320e48693686a9b2f305a150bf44cedc0c98f24e8c93ebcafb0bd4151ef981140860ad4708de532c8130	0	\N	user	\N
8eeae12e-9c50-40b9-9c92-9821a1605d40	ALmed	2026-02-05 23:01:47.905+07	2026-01-19 03:10:51.674+07	doanthienan54@gmail.com	\N	\N	ad5a90f7f6b5230033bfd23f447844697cdb751a5bc2de319884fbf92f3b8792	a3aeccaec75650ae9d9fe6e5c406170a66470668b734409932f9686cdcae521cf5ba10ac5f8f2a6d8ea283e4e317cf007d528e04c98adc1068a2b6efe55eb792bfb3e763ac4329bd248b1371814d7cfc6c93707ec148262149b594ba3f8d554cca00b6135f9016202f6f115e42658f54b54a0a567bc94bd4e21bdee3ae886928dc4c8b4c68c8baa820e446f432c3b4f8b876d188f60382eac3b1f1362aaaa14475fa8245b2a834cdb82e2ac520424994020a1a386302b8cbd05e8f34d82a8b0c4f304d1b53e46bdab0215c61bcae70b2e006d71d449efd2421d48da30e50097c1393f579ce3c19f9c6e8f68493c323f9bfe63fe70b45f83e4feced1d62124b3ff0794dd09d5f63b8892270925c5cfd1b98612f0f29710a4cf04a39d0ededec379a5bd8f4c2e2a1c2aa497190efeeb067262712ae484391bf4ec5c2a25b157354f82df5689575f5c0d2576062c791375bcaa83f96815daba39372d3a1753503fd5e802291736a602e81617a1e1ba3194bce2be09dc0d7c4b6cf69c4eca049cce75f01f4de5983798516f8c1ef38f0dffde539a1cd29be8965c87c974f29f53cb64b598932c6fc2efe551b04d0fa81ade10bfdc85ee60d7d23567a96ddad08886b219aa7cc475778418d2deb8077235a8ffb817db632072b567fdfecaee7deb7483e16a85b701e44453ed076310d6874a92ce918abe1e4e8c46d15a680c8119ef9	0	\N	superadmin	\N
\.


--
-- Data for Name: users_sessions; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.users_sessions (_order, _parent_id, id, created_at, expires_at) FROM stdin;
1	adda9aed-80d3-4074-a99c-fb164dafc946	049cfc76-9890-4dfb-94f5-8826edd5ca8d	2026-01-28 06:16:21.031+07	2026-01-28 08:16:21.031+07
1	795e508e-82e2-4a4e-af56-19cb0b481a00	e66d8ea2-df3f-426a-9103-fe6452900128	2026-02-07 15:30:57.808+07	2026-02-07 17:30:57.808+07
1	6916d1b6-eb4b-453d-8742-923c4b614720	56990d25-af50-413c-8b9b-e58946294279	2026-02-09 21:15:24.112+07	2026-02-10 01:15:06.71+07
1	8eeae12e-9c50-40b9-9c92-9821a1605d40	057fdf14-7611-47bd-8f7a-baa323d2382e	2026-02-13 11:28:01.492+07	2026-02-13 13:28:01.492+07
\.


--
-- Name: chapters_rels_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.chapters_rels_id_seq', 1, false);


--
-- Name: comments_rels_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.comments_rels_id_seq', 50, true);


--
-- Name: mangas_rels_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.mangas_rels_id_seq', 214, true);


--
-- Name: payload_locked_documents_rels_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.payload_locked_documents_rels_id_seq', 40, true);


--
-- Name: payload_preferences_rels_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.payload_preferences_rels_id_seq', 100, true);


--
-- Name: comments admin_comments_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.comments
    ADD CONSTRAINT admin_comments_pkey PRIMARY KEY (id);


--
-- Name: authors authors_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.authors
    ADD CONSTRAINT authors_pkey PRIMARY KEY (id);


--
-- Name: banners banners_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.banners
    ADD CONSTRAINT banners_pkey PRIMARY KEY (id);


--
-- Name: categories categories_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_pkey PRIMARY KEY (id);


--
-- Name: chapters_pages chapters_pages_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.chapters_pages
    ADD CONSTRAINT chapters_pages_pkey PRIMARY KEY (id);


--
-- Name: chapters chapters_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.chapters
    ADD CONSTRAINT chapters_pkey PRIMARY KEY (id);


--
-- Name: chapters_rels chapters_rels_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.chapters_rels
    ADD CONSTRAINT chapters_rels_pkey PRIMARY KEY (id);


--
-- Name: comments_rels comments_rels_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.comments_rels
    ADD CONSTRAINT comments_rels_pkey PRIMARY KEY (id);


--
-- Name: effect_comments effect_comments_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.effect_comments
    ADD CONSTRAINT effect_comments_pkey PRIMARY KEY (id);


--
-- Name: follows follows_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.follows
    ADD CONSTRAINT follows_pkey PRIMARY KEY (id);


--
-- Name: mangas mangas_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.mangas
    ADD CONSTRAINT mangas_pkey PRIMARY KEY (id);


--
-- Name: mangas_rels mangas_rels_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.mangas_rels
    ADD CONSTRAINT mangas_rels_pkey PRIMARY KEY (id);


--
-- Name: media media_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.media
    ADD CONSTRAINT media_pkey PRIMARY KEY (id);


--
-- Name: payload_kv payload_kv_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payload_kv
    ADD CONSTRAINT payload_kv_pkey PRIMARY KEY (id);


--
-- Name: payload_locked_documents payload_locked_documents_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payload_locked_documents
    ADD CONSTRAINT payload_locked_documents_pkey PRIMARY KEY (id);


--
-- Name: payload_locked_documents_rels payload_locked_documents_rels_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payload_locked_documents_rels
    ADD CONSTRAINT payload_locked_documents_rels_pkey PRIMARY KEY (id);


--
-- Name: payload_migrations payload_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payload_migrations
    ADD CONSTRAINT payload_migrations_pkey PRIMARY KEY (id);


--
-- Name: payload_preferences payload_preferences_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payload_preferences
    ADD CONSTRAINT payload_preferences_pkey PRIMARY KEY (id);


--
-- Name: payload_preferences_rels payload_preferences_rels_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payload_preferences_rels
    ADD CONSTRAINT payload_preferences_rels_pkey PRIMARY KEY (id);


--
-- Name: ratings ratings_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ratings
    ADD CONSTRAINT ratings_pkey PRIMARY KEY (id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: users_sessions users_sessions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users_sessions
    ADD CONSTRAINT users_sessions_pkey PRIMARY KEY (id);


--
-- Name: authors_avatar_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX authors_avatar_idx ON public.authors USING btree (avatar_id);


--
-- Name: authors_created_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX authors_created_at_idx ON public.authors USING btree (created_at);


--
-- Name: authors_name_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX authors_name_idx ON public.authors USING btree (name);


--
-- Name: authors_slug_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX authors_slug_idx ON public.authors USING btree (slug);


--
-- Name: authors_updated_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX authors_updated_at_idx ON public.authors USING btree (updated_at);


--
-- Name: banners_created_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX banners_created_at_idx ON public.banners USING btree (created_at);


--
-- Name: banners_image_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX banners_image_idx ON public.banners USING btree (image_id);


--
-- Name: banners_updated_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX banners_updated_at_idx ON public.banners USING btree (updated_at);


--
-- Name: categories_created_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX categories_created_at_idx ON public.categories USING btree (created_at);


--
-- Name: categories_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX categories_order_idx ON public.categories USING btree ("order");


--
-- Name: categories_parent_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX categories_parent_idx ON public.categories USING btree (parent_id);


--
-- Name: categories_slug_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX categories_slug_idx ON public.categories USING btree (slug);


--
-- Name: categories_updated_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX categories_updated_at_idx ON public.categories USING btree (updated_at);


--
-- Name: chapters_chapter_number_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX chapters_chapter_number_idx ON public.chapters USING btree (chapter_number);


--
-- Name: chapters_created_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX chapters_created_at_idx ON public.chapters USING btree (created_at);


--
-- Name: chapters_created_by_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX chapters_created_by_idx ON public.chapters USING btree (created_by_id);


--
-- Name: chapters_manga_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX chapters_manga_idx ON public.chapters USING btree (manga_id);


--
-- Name: chapters_pages_image_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX chapters_pages_image_idx ON public.chapters_pages USING btree (image_id);


--
-- Name: chapters_pages_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX chapters_pages_order_idx ON public.chapters_pages USING btree (_order);


--
-- Name: chapters_pages_parent_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX chapters_pages_parent_id_idx ON public.chapters_pages USING btree (_parent_id);


--
-- Name: chapters_rels_media_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX chapters_rels_media_id_idx ON public.chapters_rels USING btree (media_id);


--
-- Name: chapters_rels_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX chapters_rels_order_idx ON public.chapters_rels USING btree ("order");


--
-- Name: chapters_rels_parent_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX chapters_rels_parent_idx ON public.chapters_rels USING btree (parent_id);


--
-- Name: chapters_rels_path_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX chapters_rels_path_idx ON public.chapters_rels USING btree (path);


--
-- Name: chapters_slug_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX chapters_slug_idx ON public.chapters USING btree (slug);


--
-- Name: chapters_updated_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX chapters_updated_at_idx ON public.chapters USING btree (updated_at);


--
-- Name: comments_created_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX comments_created_at_idx ON public.comments USING btree (created_at);


--
-- Name: comments_effect_comment_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX comments_effect_comment_idx ON public.comments USING btree (effect_comment_id);


--
-- Name: comments_parent_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX comments_parent_idx ON public.comments USING btree (parent_id);


--
-- Name: comments_rels_chapters_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX comments_rels_chapters_id_idx ON public.comments_rels USING btree (chapters_id);


--
-- Name: comments_rels_mangas_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX comments_rels_mangas_id_idx ON public.comments_rels USING btree (mangas_id);


--
-- Name: comments_rels_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX comments_rels_order_idx ON public.comments_rels USING btree ("order");


--
-- Name: comments_rels_parent_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX comments_rels_parent_idx ON public.comments_rels USING btree (parent_id);


--
-- Name: comments_rels_path_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX comments_rels_path_idx ON public.comments_rels USING btree (path);


--
-- Name: comments_type_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX comments_type_idx ON public.comments USING btree (type);


--
-- Name: comments_updated_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX comments_updated_at_idx ON public.comments USING btree (updated_at);


--
-- Name: comments_user_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX comments_user_idx ON public.comments USING btree (user_id);


--
-- Name: effect_comments_author_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX effect_comments_author_idx ON public.effect_comments USING btree (author_id);


--
-- Name: effect_comments_created_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX effect_comments_created_at_idx ON public.effect_comments USING btree (created_at);


--
-- Name: effect_comments_is_pinned_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX effect_comments_is_pinned_idx ON public.effect_comments USING btree (is_pinned);


--
-- Name: effect_comments_tag_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX effect_comments_tag_idx ON public.effect_comments USING btree (tag);


--
-- Name: effect_comments_updated_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX effect_comments_updated_at_idx ON public.effect_comments USING btree (updated_at);


--
-- Name: follows_created_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX follows_created_at_idx ON public.follows USING btree (created_at);


--
-- Name: follows_manga_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX follows_manga_idx ON public.follows USING btree (manga_id);


--
-- Name: follows_updated_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX follows_updated_at_idx ON public.follows USING btree (updated_at);


--
-- Name: follows_user_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX follows_user_idx ON public.follows USING btree (user_id);


--
-- Name: manga_user_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX manga_user_idx ON public.ratings USING btree (manga_id, user_id);


--
-- Name: mangas_author_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX mangas_author_idx ON public.mangas USING btree (author_id);


--
-- Name: mangas_cover_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX mangas_cover_idx ON public.mangas USING btree (cover_id);


--
-- Name: mangas_created_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX mangas_created_at_idx ON public.mangas USING btree (created_at);


--
-- Name: mangas_latest_chapter_latest_chapter_updated_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX mangas_latest_chapter_latest_chapter_updated_at_idx ON public.mangas USING btree (latest_chapter_updated_at);


--
-- Name: mangas_owner_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX mangas_owner_idx ON public.mangas USING btree (owner_id);


--
-- Name: mangas_rels_categories_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX mangas_rels_categories_id_idx ON public.mangas_rels USING btree (categories_id);


--
-- Name: mangas_rels_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX mangas_rels_order_idx ON public.mangas_rels USING btree ("order");


--
-- Name: mangas_rels_parent_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX mangas_rels_parent_idx ON public.mangas_rels USING btree (parent_id);


--
-- Name: mangas_rels_path_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX mangas_rels_path_idx ON public.mangas_rels USING btree (path);


--
-- Name: mangas_slug_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX mangas_slug_idx ON public.mangas USING btree (slug);


--
-- Name: mangas_updated_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX mangas_updated_at_idx ON public.mangas USING btree (updated_at);


--
-- Name: media_created_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX media_created_at_idx ON public.media USING btree (created_at);


--
-- Name: media_filename_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX media_filename_idx ON public.media USING btree (filename);


--
-- Name: media_updated_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX media_updated_at_idx ON public.media USING btree (updated_at);


--
-- Name: payload_kv_key_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX payload_kv_key_idx ON public.payload_kv USING btree (key);


--
-- Name: payload_locked_documents_created_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX payload_locked_documents_created_at_idx ON public.payload_locked_documents USING btree (created_at);


--
-- Name: payload_locked_documents_global_slug_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX payload_locked_documents_global_slug_idx ON public.payload_locked_documents USING btree (global_slug);


--
-- Name: payload_locked_documents_rels_authors_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX payload_locked_documents_rels_authors_id_idx ON public.payload_locked_documents_rels USING btree (authors_id);


--
-- Name: payload_locked_documents_rels_banners_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX payload_locked_documents_rels_banners_id_idx ON public.payload_locked_documents_rels USING btree (banners_id);


--
-- Name: payload_locked_documents_rels_categories_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX payload_locked_documents_rels_categories_id_idx ON public.payload_locked_documents_rels USING btree (categories_id);


--
-- Name: payload_locked_documents_rels_chapters_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX payload_locked_documents_rels_chapters_id_idx ON public.payload_locked_documents_rels USING btree (chapters_id);


--
-- Name: payload_locked_documents_rels_comments_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX payload_locked_documents_rels_comments_id_idx ON public.payload_locked_documents_rels USING btree (comments_id);


--
-- Name: payload_locked_documents_rels_effect_comments_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX payload_locked_documents_rels_effect_comments_id_idx ON public.payload_locked_documents_rels USING btree (effect_comments_id);


--
-- Name: payload_locked_documents_rels_follows_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX payload_locked_documents_rels_follows_id_idx ON public.payload_locked_documents_rels USING btree (follows_id);


--
-- Name: payload_locked_documents_rels_mangas_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX payload_locked_documents_rels_mangas_id_idx ON public.payload_locked_documents_rels USING btree (mangas_id);


--
-- Name: payload_locked_documents_rels_media_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX payload_locked_documents_rels_media_id_idx ON public.payload_locked_documents_rels USING btree (media_id);


--
-- Name: payload_locked_documents_rels_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX payload_locked_documents_rels_order_idx ON public.payload_locked_documents_rels USING btree ("order");


--
-- Name: payload_locked_documents_rels_parent_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX payload_locked_documents_rels_parent_idx ON public.payload_locked_documents_rels USING btree (parent_id);


--
-- Name: payload_locked_documents_rels_path_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX payload_locked_documents_rels_path_idx ON public.payload_locked_documents_rels USING btree (path);


--
-- Name: payload_locked_documents_rels_ratings_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX payload_locked_documents_rels_ratings_id_idx ON public.payload_locked_documents_rels USING btree (ratings_id);


--
-- Name: payload_locked_documents_rels_users_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX payload_locked_documents_rels_users_id_idx ON public.payload_locked_documents_rels USING btree (users_id);


--
-- Name: payload_locked_documents_updated_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX payload_locked_documents_updated_at_idx ON public.payload_locked_documents USING btree (updated_at);


--
-- Name: payload_migrations_created_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX payload_migrations_created_at_idx ON public.payload_migrations USING btree (created_at);


--
-- Name: payload_migrations_updated_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX payload_migrations_updated_at_idx ON public.payload_migrations USING btree (updated_at);


--
-- Name: payload_preferences_created_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX payload_preferences_created_at_idx ON public.payload_preferences USING btree (created_at);


--
-- Name: payload_preferences_key_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX payload_preferences_key_idx ON public.payload_preferences USING btree (key);


--
-- Name: payload_preferences_rels_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX payload_preferences_rels_order_idx ON public.payload_preferences_rels USING btree ("order");


--
-- Name: payload_preferences_rels_parent_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX payload_preferences_rels_parent_idx ON public.payload_preferences_rels USING btree (parent_id);


--
-- Name: payload_preferences_rels_path_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX payload_preferences_rels_path_idx ON public.payload_preferences_rels USING btree (path);


--
-- Name: payload_preferences_rels_users_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX payload_preferences_rels_users_id_idx ON public.payload_preferences_rels USING btree (users_id);


--
-- Name: payload_preferences_updated_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX payload_preferences_updated_at_idx ON public.payload_preferences USING btree (updated_at);


--
-- Name: ratings_created_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX ratings_created_at_idx ON public.ratings USING btree (created_at);


--
-- Name: ratings_manga_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX ratings_manga_idx ON public.ratings USING btree (manga_id);


--
-- Name: ratings_updated_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX ratings_updated_at_idx ON public.ratings USING btree (updated_at);


--
-- Name: ratings_user_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX ratings_user_idx ON public.ratings USING btree (user_id);


--
-- Name: user_manga_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX user_manga_idx ON public.follows USING btree (user_id, manga_id);


--
-- Name: users_avatar_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX users_avatar_idx ON public.users USING btree (avatar_id);


--
-- Name: users_created_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX users_created_at_idx ON public.users USING btree (created_at);


--
-- Name: users_email_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX users_email_idx ON public.users USING btree (email);


--
-- Name: users_sessions_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX users_sessions_order_idx ON public.users_sessions USING btree (_order);


--
-- Name: users_sessions_parent_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX users_sessions_parent_id_idx ON public.users_sessions USING btree (_parent_id);


--
-- Name: users_updated_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX users_updated_at_idx ON public.users USING btree (updated_at);


--
-- Name: users_username_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX users_username_idx ON public.users USING btree (username);


--
-- Name: authors authors_avatar_id_media_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.authors
    ADD CONSTRAINT authors_avatar_id_media_id_fk FOREIGN KEY (avatar_id) REFERENCES public.media(id) ON DELETE SET NULL;


--
-- Name: banners banners_image_id_media_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.banners
    ADD CONSTRAINT banners_image_id_media_id_fk FOREIGN KEY (image_id) REFERENCES public.media(id) ON DELETE SET NULL;


--
-- Name: categories categories_parent_id_categories_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_parent_id_categories_id_fk FOREIGN KEY (parent_id) REFERENCES public.categories(id) ON DELETE SET NULL;


--
-- Name: chapters chapters_created_by_id_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.chapters
    ADD CONSTRAINT chapters_created_by_id_users_id_fk FOREIGN KEY (created_by_id) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- Name: chapters chapters_manga_id_mangas_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.chapters
    ADD CONSTRAINT chapters_manga_id_mangas_id_fk FOREIGN KEY (manga_id) REFERENCES public.mangas(id) ON DELETE SET NULL;


--
-- Name: chapters_pages chapters_pages_image_id_media_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.chapters_pages
    ADD CONSTRAINT chapters_pages_image_id_media_id_fk FOREIGN KEY (image_id) REFERENCES public.media(id) ON DELETE SET NULL;


--
-- Name: chapters_pages chapters_pages_parent_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.chapters_pages
    ADD CONSTRAINT chapters_pages_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.chapters(id) ON DELETE CASCADE;


--
-- Name: chapters_rels chapters_rels_media_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.chapters_rels
    ADD CONSTRAINT chapters_rels_media_fk FOREIGN KEY (media_id) REFERENCES public.media(id) ON DELETE CASCADE;


--
-- Name: chapters_rels chapters_rels_parent_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.chapters_rels
    ADD CONSTRAINT chapters_rels_parent_fk FOREIGN KEY (parent_id) REFERENCES public.chapters(id) ON DELETE CASCADE;


--
-- Name: comments comments_effect_comment_id_effect_comments_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.comments
    ADD CONSTRAINT comments_effect_comment_id_effect_comments_id_fk FOREIGN KEY (effect_comment_id) REFERENCES public.effect_comments(id) ON DELETE SET NULL;


--
-- Name: comments comments_parent_id_comments_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.comments
    ADD CONSTRAINT comments_parent_id_comments_id_fk FOREIGN KEY (parent_id) REFERENCES public.comments(id) ON DELETE SET NULL;


--
-- Name: comments_rels comments_rels_chapters_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.comments_rels
    ADD CONSTRAINT comments_rels_chapters_fk FOREIGN KEY (chapters_id) REFERENCES public.chapters(id) ON DELETE CASCADE;


--
-- Name: comments_rels comments_rels_mangas_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.comments_rels
    ADD CONSTRAINT comments_rels_mangas_fk FOREIGN KEY (mangas_id) REFERENCES public.mangas(id) ON DELETE CASCADE;


--
-- Name: comments_rels comments_rels_parent_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.comments_rels
    ADD CONSTRAINT comments_rels_parent_fk FOREIGN KEY (parent_id) REFERENCES public.comments(id) ON DELETE CASCADE;


--
-- Name: comments comments_user_id_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.comments
    ADD CONSTRAINT comments_user_id_users_id_fk FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- Name: effect_comments effect_comments_author_id_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.effect_comments
    ADD CONSTRAINT effect_comments_author_id_users_id_fk FOREIGN KEY (author_id) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- Name: follows follows_manga_id_mangas_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.follows
    ADD CONSTRAINT follows_manga_id_mangas_id_fk FOREIGN KEY (manga_id) REFERENCES public.mangas(id) ON DELETE SET NULL;


--
-- Name: follows follows_user_id_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.follows
    ADD CONSTRAINT follows_user_id_users_id_fk FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- Name: mangas mangas_author_id_authors_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.mangas
    ADD CONSTRAINT mangas_author_id_authors_id_fk FOREIGN KEY (author_id) REFERENCES public.authors(id) ON DELETE SET NULL;


--
-- Name: mangas mangas_cover_id_media_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.mangas
    ADD CONSTRAINT mangas_cover_id_media_id_fk FOREIGN KEY (cover_id) REFERENCES public.media(id) ON DELETE SET NULL;


--
-- Name: mangas mangas_owner_id_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.mangas
    ADD CONSTRAINT mangas_owner_id_users_id_fk FOREIGN KEY (owner_id) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- Name: mangas_rels mangas_rels_categories_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.mangas_rels
    ADD CONSTRAINT mangas_rels_categories_fk FOREIGN KEY (categories_id) REFERENCES public.categories(id) ON DELETE CASCADE;


--
-- Name: mangas_rels mangas_rels_parent_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.mangas_rels
    ADD CONSTRAINT mangas_rels_parent_fk FOREIGN KEY (parent_id) REFERENCES public.mangas(id) ON DELETE CASCADE;


--
-- Name: payload_locked_documents_rels payload_locked_documents_rels_authors_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payload_locked_documents_rels
    ADD CONSTRAINT payload_locked_documents_rels_authors_fk FOREIGN KEY (authors_id) REFERENCES public.authors(id) ON DELETE CASCADE;


--
-- Name: payload_locked_documents_rels payload_locked_documents_rels_banners_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payload_locked_documents_rels
    ADD CONSTRAINT payload_locked_documents_rels_banners_fk FOREIGN KEY (banners_id) REFERENCES public.banners(id) ON DELETE CASCADE;


--
-- Name: payload_locked_documents_rels payload_locked_documents_rels_categories_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payload_locked_documents_rels
    ADD CONSTRAINT payload_locked_documents_rels_categories_fk FOREIGN KEY (categories_id) REFERENCES public.categories(id) ON DELETE CASCADE;


--
-- Name: payload_locked_documents_rels payload_locked_documents_rels_chapters_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payload_locked_documents_rels
    ADD CONSTRAINT payload_locked_documents_rels_chapters_fk FOREIGN KEY (chapters_id) REFERENCES public.chapters(id) ON DELETE CASCADE;


--
-- Name: payload_locked_documents_rels payload_locked_documents_rels_comments_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payload_locked_documents_rels
    ADD CONSTRAINT payload_locked_documents_rels_comments_fk FOREIGN KEY (comments_id) REFERENCES public.comments(id) ON DELETE CASCADE;


--
-- Name: payload_locked_documents_rels payload_locked_documents_rels_effect_comments_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payload_locked_documents_rels
    ADD CONSTRAINT payload_locked_documents_rels_effect_comments_fk FOREIGN KEY (effect_comments_id) REFERENCES public.effect_comments(id) ON DELETE CASCADE;


--
-- Name: payload_locked_documents_rels payload_locked_documents_rels_follows_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payload_locked_documents_rels
    ADD CONSTRAINT payload_locked_documents_rels_follows_fk FOREIGN KEY (follows_id) REFERENCES public.follows(id) ON DELETE CASCADE;


--
-- Name: payload_locked_documents_rels payload_locked_documents_rels_mangas_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payload_locked_documents_rels
    ADD CONSTRAINT payload_locked_documents_rels_mangas_fk FOREIGN KEY (mangas_id) REFERENCES public.mangas(id) ON DELETE CASCADE;


--
-- Name: payload_locked_documents_rels payload_locked_documents_rels_media_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payload_locked_documents_rels
    ADD CONSTRAINT payload_locked_documents_rels_media_fk FOREIGN KEY (media_id) REFERENCES public.media(id) ON DELETE CASCADE;


--
-- Name: payload_locked_documents_rels payload_locked_documents_rels_parent_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payload_locked_documents_rels
    ADD CONSTRAINT payload_locked_documents_rels_parent_fk FOREIGN KEY (parent_id) REFERENCES public.payload_locked_documents(id) ON DELETE CASCADE;


--
-- Name: payload_locked_documents_rels payload_locked_documents_rels_ratings_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payload_locked_documents_rels
    ADD CONSTRAINT payload_locked_documents_rels_ratings_fk FOREIGN KEY (ratings_id) REFERENCES public.ratings(id) ON DELETE CASCADE;


--
-- Name: payload_locked_documents_rels payload_locked_documents_rels_users_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payload_locked_documents_rels
    ADD CONSTRAINT payload_locked_documents_rels_users_fk FOREIGN KEY (users_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: payload_preferences_rels payload_preferences_rels_parent_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payload_preferences_rels
    ADD CONSTRAINT payload_preferences_rels_parent_fk FOREIGN KEY (parent_id) REFERENCES public.payload_preferences(id) ON DELETE CASCADE;


--
-- Name: payload_preferences_rels payload_preferences_rels_users_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payload_preferences_rels
    ADD CONSTRAINT payload_preferences_rels_users_fk FOREIGN KEY (users_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: ratings ratings_manga_id_mangas_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ratings
    ADD CONSTRAINT ratings_manga_id_mangas_id_fk FOREIGN KEY (manga_id) REFERENCES public.mangas(id) ON DELETE SET NULL;


--
-- Name: ratings ratings_user_id_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ratings
    ADD CONSTRAINT ratings_user_id_users_id_fk FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- Name: users users_avatar_id_media_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_avatar_id_media_id_fk FOREIGN KEY (avatar_id) REFERENCES public.media(id) ON DELETE SET NULL;


--
-- Name: users_sessions users_sessions_parent_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users_sessions
    ADD CONSTRAINT users_sessions_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

\unrestrict mr8E2WkGCRGU5BMJ4bFDx0SRu9koV7XsdUKCdqSKmPrzX9fnB4HlvOfN2drOHDe

