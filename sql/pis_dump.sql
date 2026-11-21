--
-- PostgreSQL database dump
--

-- Dumped from database version 17.5 (Debian 17.5-1.pgdg110+1)
-- Dumped by pg_dump version 17.5 (Debian 17.5-1.pgdg110+1)

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

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: granicni_prelazi; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.granicni_prelazi (
    id integer NOT NULL,
    naziv text NOT NULL,
    drzava text NOT NULL,
    tip text,
    izvor text,
    geom public.geometry(Point,4326) NOT NULL
);


--
-- Name: granicni_prelazi_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.granicni_prelazi_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: granicni_prelazi_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.granicni_prelazi_id_seq OWNED BY public.granicni_prelazi.id;


--
-- Name: hidroelektrane; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.hidroelektrane (
    id integer NOT NULL,
    naziv text,
    kod text,
    snaga numeric,
    nivo integer,
    geom public.geometry(Point,4326)
);


--
-- Name: hidroelektrane_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.hidroelektrane_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: hidroelektrane_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.hidroelektrane_id_seq OWNED BY public.hidroelektrane.id;


--
-- Name: termoelektrane; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.termoelektrane (
    id integer NOT NULL,
    naziv text,
    kod text,
    snagagen numeric,
    snagaprag numeric,
    geom public.geometry(Point,4326)
);


--
-- Name: termoelektrane_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.termoelektrane_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: termoelektrane_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.termoelektrane_id_seq OWNED BY public.termoelektrane.id;


--
-- Name: granicni_prelazi id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.granicni_prelazi ALTER COLUMN id SET DEFAULT nextval('public.granicni_prelazi_id_seq'::regclass);


--
-- Name: hidroelektrane id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.hidroelektrane ALTER COLUMN id SET DEFAULT nextval('public.hidroelektrane_id_seq'::regclass);


--
-- Name: termoelektrane id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.termoelektrane ALTER COLUMN id SET DEFAULT nextval('public.termoelektrane_id_seq'::regclass);


--
-- Data for Name: granicni_prelazi; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.granicni_prelazi (id, naziv, drzava, tip, izvor, geom) FROM stdin;
1	Horgoš	Mađarska	drumski (autoput A1)	OSM Nominatim, objekat graničnog prelaza	0101000020E610000070E998F38CF93340AD307DAF21164740
2	Kelebija	Mađarska	drumski	OSM Nominatim, objekat graničnog prelaza	0101000020E610000000E31934F48F3340A62BD8463C154740
3	Šid	Hrvatska	drumski	OSM Nominatim, objekat graničnog prelaza	0101000020E610000018CE35CCD02C3340CCB22781CD934640
4	Bezdan	Hrvatska	drumski	OSM Nominatim, objekat graničnog prelaza	0101000020E6100000AD4ECE50DCDD3240522CB7B41AEC4640
5	Bogojevo	Hrvatska	drumski	OSM Nominatim, objekat graničnog prelaza	0101000020E6100000B471C45A7C163340060FD3BEB9C34640
6	Sremska Rača	Bosna i Hercegovina	drumski	OSM Nominatim, objekat graničnog prelaza	0101000020E6100000700B96EA024E3340B398D87C5C754640
7	Kotroman	Bosna i Hercegovina	drumski	OSM Nominatim, objekat graničnog prelaza	0101000020E6100000A96C5853597833406F9EEA909BE14540
8	Gostun	Crna Gora	drumski	OSM Nominatim, objekat graničnog prelaza	0101000020E61000009CA6CF0EB8C2334087342A70B2974540
9	Preševo	Severna Makedonija	drumski (autoput A1)	OSM Nominatim, objekat graničnog prelaza	0101000020E6100000B2BAD573D2B33540FFB27BF2B01E4540
10	Gradina	Bugarska	drumski (autoput A4)	OSM Nominatim, objekat graničnog prelaza	0101000020E6100000BD73284355D43640E3E0D231E77F4540
11	Vrška Čuka	Bugarska	drumski	OSM Nominatim, objekat graničnog prelaza	0101000020E61000006CD097DEFE6036403317B83CD6EC4540
12	Mali Zvornik	Bosna i Hercegovina	drumski	OSM Nominatim, objekat graničnog prelaza	0101000020E6100000E9D66B7A502033408E3C1059A4334640
13	Prohor Pčinjski	Severna Makedonija	drumski	OSM Nominatim, objekat graničnog prelaza	0101000020E6100000DD7A4D0F0AE23540279F1EDB32284540
14	Badovinci	Bosna i Hercegovina	drumski	OSM Nominatim, objekat graničnog prelaza	0101000020E6100000793E03EACD5833402E3BC43F6C634640
15	Batrovci	Hrvatska	drumski (autoput A3)	OSM Nominatim, naselje uz prelaz (približno)	0101000020E6100000C58D5BCCCF213340105839B4C8864640
16	Vatin	Rumunija	drumski	OSM Nominatim, naselje uz prelaz (približno)	0101000020E6100000371B2B31CF3E3540668522DDCF9D4640
17	Kaluđerovo	Rumunija	drumski	OSM Nominatim, naselje uz prelaz (približno)	0101000020E6100000B1E1E995B28C354015E63DCE34734640
18	Mokranje	Bugarska	drumski	OSM Nominatim, naselje uz prelaz (približno)	0101000020E6100000CC441152B78B3640242713B70A144640
19	Jamena	Bosna i Hercegovina	drumski	OSM Nominatim, naselje uz prelaz (približno)	0101000020E610000059BF99982E1033408C2D043928714640
20	Ljubovija	Bosna i Hercegovina	drumski	OSM Nominatim, naselje uz prelaz (približno)	0101000020E610000070ED444948603340747D1F0E12184640
21	Rabe	Mađarska	drumski	OSM Nominatim, naselje uz prelaz (približno)	0101000020E6100000AC3AAB05F64034408C9E5BE84A0E4740
22	Nakovo	Rumunija	drumski	OSM Nominatim, naselje uz prelaz (približno)	0101000020E610000059A5F44C2F9134409C340D8AE6EF4640
23	Jabuka	Crna Gora	drumski	OSM Nominatim, naselje uz prelaz (približno)	0101000020E6100000A59E05A1BC833340041F8315A7AC4540
24	Špiljani	Crna Gora	drumski	OSM Nominatim, naselje uz prelaz (približno)	0101000020E610000048197101685834408143A852B3754540
25	Đerdap I	Rumunija	drumski (preko brane HE Đerdap I)	lokacija brane iz sloja hidroelektrane	0101000020E6100000CFBD874B8E87364063F030ED9B554640
\.


--
-- Data for Name: hidroelektrane; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.hidroelektrane (id, naziv, kod, snaga, nivo, geom) FROM stdin;
1	Đerdap I	B10	1057.8	3	0101000020E610000028C1D1448E8736408C6FDEEE9B554640
3	Potpeć	B10	51.0	3	0101000020E6100000E3079DC6AC933340FA2C2A3D2EC34540
4	Kokin Brod	B10	22.0	3	0101000020E6100000A8A55E5C4FCF3340AE56DC6E38C24540
5	Uvac	B10	36.0	3	0101000020E6100000F9ED354E54EE3340BFAFDBB122B64540
6	Bistrica	B10	102.0	3	0101000020E6100000DE86623C94A833405C9CE73EEFBC4540
8	Prijepolje	B10	0.0	3	0101000020E6100000FEC9294BBE953340897C975297B04540
9	Ivanjica	B10	0.0	3	0101000020E610000011FDDAFAE93B3440A5E2B5018ECA4540
10	Kamenica	B10	0.0	3	0101000020E610000067C2E567D9B73440835D031198CB4540
11	Sokolovica	B10	0.0	3	0101000020E61000006FC1AD16335F3640BB698E07B6034640
12	Gamzigrad	B10	0.0	3	0101000020E61000003BEA9E2B002C36404DC928852FF64540
14	Toponica	B10	0.0	3	0101000020E6100000E004F060D5343640C2058F25629B4540
15	Modra Stena	B10	0.0	3	0101000020E6100000EFCA2E185C4F36406A0EB5125F804540
16	Đerdap II	B10	208.0	3	0101000020E6100000E38920CEC39136405F398C930C274640
17	Topli Do	B10	0.0	3	0101000020E6100000B6FFB74890AC36403F7BE4C578AB4540
18	Rudine	B10	0.0	3	0101000020E61000008CD7BCAAB39436405823168CA5A44540
19	Dojkinci	B10	0.0	3	0101000020E6100000BCB43C6AA7C93640C4211B48179D4540
21	Pirot	B10	80.0	3	0101000020E61000004A6BC2AC069D364047C5A464DE934540
23	Rsovci	B10	0.0	3	0101000020E6100000D731AEB838C83640773469AE2E964540
24	Gazivode	B10	35.0	3	0101000020E610000032923D42CDAA3440D75E55078A774540
26	Novo Selo	B10	0.0	3	0101000020E6100000F40E01D1DD4F3440D3591C846F5E4540
27	Gazivode	B10	0.0	3	0101000020E61000007A6DDB9CEF763440E08101840F7C4540
28	Istok	B10	0.0	3	0101000020E6100000ABF8D04F827C3440670124E4CD644540
29	Zvornik	B10	92.8	3	0101000020E61000000791B17F431B3340D7AF2AB1212F4640
33	Vrla III	B10	29.4	3	0101000020E61000002480F67EFE2A36403B7F243669564540
34	Vrla II	B10	23.8	3	0101000020E61000003845ECB8864236409BB40474BA584540
35	Vrla I	B10	50.5	3	0101000020E61000004FE38343144A3640F07101C34D564540
37	Vrla IV	B10	24.8	3	0101000020E6100000D4ADE820F91236407ECDCD925B564540
38	Stajkovce	B10	0.0	3	0101000020E6100000080B8222711E3640EED34C52F4504540
39	Lisina	B10	0.0	3	0101000020E61000006E41A500076336405109997510484540
41	Rzav	B10	0.0	3	0101000020E6100000B3220FE95C023440AB8ABA206CE04540
2	Međuvršje	B10	6.0	3	0101000020E6100000D5CA845FEA3B3440320400C79EF44540
7	Sopoćani	B10	0.0	3	0101000020E6100000F909B144B1683440FEAE192A10914540
13	Sićevo	B10	0.0	3	0101000020E61000001A4927B7921036407B212E4A1AAA4540
20	Široke Luke	B10	0.0	3	0101000020E6100000717BDD7DE9D8364088635DDC469F4540
22	Visočka Ržana	B10	0.0	3	0101000020E610000083740C2318D03640BBF9FCE6B4944540
25	Kožnjar	B10	0.0	3	0101000020E61000004AA24DC4112E3440D684FE53BB4B4540
30	Bajina Bašta	B10	364.0	3	0101000020E6100000E0A8CB18D56A33406E4CF49E6FFB4540
31	RHE Bajina Bašta	B10	614.0	3	0101000020E6100000093D51C8846A3340E109BDFE24FB4540
32	Bučje	B10	0.0	3	0101000020E61000000FE1A991A76C3340BE74498BE9BC4540
36	Vučje	B10	0.0	3	0101000020E61000005DC136E2C9EA3540DD4A0A87396D4540
40	Ovčar Banja	B10	6.0	3	0101000020E61000000562235A3C303440DD184C0D7EF34540
\.


--
-- Data for Name: termoelektrane; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.termoelektrane (id, naziv, kod, snagagen, snagaprag, geom) FROM stdin;
1	Novi Sad	B11	255.0	208.0	0101000020E61000000A849D62D5E43340E71A66683CA24640
2	Nikola Tesla A	B11	1650.5	1502.0	0101000020E610000032F66FA8292934408A5F0C40FE554640
3	Nikola Tesla B	B11	1240.0	1160.0	0101000020E6100000C1898D1E64023440EC623F30EC534640
4	TO Zrenjanin	B11	120.0	111.0	0101000020E61000001B4C1EAA846834403FF1AD5978AD4640
5	TO Beograd	B11	96.0	84.0	0101000020E6100000BA6180E959693440955FABA9D1664640
6	Sremska Mitrovica	B11	50.5	45.0	0101000020E610000064ACDB453DA733400B6366FA807B4640
7	Kolubara A	B11	270.0	245.0	0101000020E61000003E95D39E924B34406627CD30FF3D4640
8	Morava	B11	125.0	108.0	0101000020E6100000C1559E40D82935407823980FAD1C4640
9	Kosovo B	B11	678.0	618.0	0101000020E6100000FDB561B94A0E3540C5B1892716594540
10	Kosovo A	B11	800.0	617.0	0101000020E6100000925D6919A9173540E8548DB9C6564540
11	Kostolac B	B11	698.0	640.0	0101000020E6100000A5EFDA4A5440354008D858D3065B4640
12	Kostolac A	B11	310.0	281.0	0101000020E6100000DEDD14A0B72C3540CDE7DCED7A5C4640
13	Nepoznata termoelektrana	B11	0.0	0.0	0101000020E61000000CB4965D8B3B3440903CC6CB89404640
14	Nepoznata termoelektrana	B11	0.0	0.0	0101000020E6100000CC28965B5A3133403EF4932012434640
15	Nepoznata termoelektrana	B11	0.0	0.0	0101000020E6100000C6562B6E371A364088E1D9D42F0E4640
\.


--
-- Name: granicni_prelazi_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.granicni_prelazi_id_seq', 25, true);


--
-- Name: hidroelektrane_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.hidroelektrane_id_seq', 41, true);


--
-- Name: termoelektrane_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.termoelektrane_id_seq', 15, true);


--
-- Name: granicni_prelazi granicni_prelazi_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.granicni_prelazi
    ADD CONSTRAINT granicni_prelazi_pkey PRIMARY KEY (id);


--
-- Name: hidroelektrane hidroelektrane_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.hidroelektrane
    ADD CONSTRAINT hidroelektrane_pkey PRIMARY KEY (id);


--
-- Name: termoelektrane termoelektrane_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.termoelektrane
    ADD CONSTRAINT termoelektrane_pkey PRIMARY KEY (id);


--
-- Name: granicni_prelazi_geom_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX granicni_prelazi_geom_idx ON public.granicni_prelazi USING gist (geom);


--
-- Name: hidroelektrane_geom_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX hidroelektrane_geom_idx ON public.hidroelektrane USING gist (geom);


--
-- Name: termoelektrane_geom_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX termoelektrane_geom_idx ON public.termoelektrane USING gist (geom);


--
-- PostgreSQL database dump complete
--

