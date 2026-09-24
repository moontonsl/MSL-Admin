<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class UserManagementController extends Controller
{
    public function index(Request $request)
    {
        if (!$request->session()->get('user_management_authorized')) {
            return view('user-management-landing');
        }

        $targetEmails = $this->getTargetEmails();

        $existingEmails = User::whereIn('email', $targetEmails)->pluck('email')->toArray();
        $missingEmails = array_diff($targetEmails, $existingEmails);

        return view('user-management', [
            'targetEmails' => $targetEmails,
            'totalTargetEmails' => count($targetEmails),
            'existingEmailsCount' => count($existingEmails),
            'missingEmailsCount' => count($missingEmails),
            'missingEmailsList' => $missingEmails
        ]);
    }

    public function verifyCode(Request $request)
    {
        $request->validate([
            'code' => 'required|string'
        ]);

        if ($request->input('code') === 'jlxgiwylr') {
            $request->session()->put('user_management_authorized', true);
            return redirect()->route('user-management');
        }

        return back()->withErrors(['code' => 'Invalid landing code.']);
    }

    public function getUsers(Request $request)
    {
        if (!$request->session()->get('user_management_authorized')) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        $perPage = $request->query('per_page', 20);
        $search = $request->query('search', '');
        $state = $request->query('state', '');

        $targetEmails = $this->getTargetEmails();

        $query = User::select(
            'id', 'name', 'surname', 'email', 'username', 'ml_id', 'ml_server',
            'university', 'year_level', 'region', 'island', 'role', 'state',
            'created_at', 'verified_date'
        )->whereIn('email', $targetEmails);

        // Apply search filter
        if (!empty($search)) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', '%' . $search . '%')
                    ->orWhere('surname', 'like', '%' . $search . '%')
                    ->orWhere('email', 'like', '%' . $search . '%')
                    ->orWhere('username', 'like', '%' . $search . '%')
                    ->orWhere('ml_id', 'like', '%' . $search . '%');
            });
        }

        // Apply state filter
        if (!empty($state)) {
            $query->where('state', $state);
        }

        $users = $query->orderByDesc('created_at')->paginate($perPage);

        // Add debug information
        $response = response()->json($users);
        $response->headers->set('X-Total-Target-Emails', count($targetEmails));
        $response->headers->set('X-Found-Users', $users->total());

        return $response;
    }

    protected function getTargetEmails()
    {
        return [
            'floresmarcangelo9@gmail.com', 'johnrafaelespino563@gmail.com', 'devildigital161@gmail.com', 'juniocrisreyver@gmail.com',
            'challejah@gmail.com', 'justinemarino656@gmail.com', 'melvvperalta@gmail.com', 'gabsantipolo@gmail.com',
            'aellamaecabahug.yahoo.com@gmail.com', 'noelito.ymas@evsu.edu.ph', 'gericgwapo12@gmail.com', 'juliomiguelcamantesabesamis@gmail.com',
            'pjbustane@gmail.com', 'jayzcartas17@gmail.com', 'telebricoshamir@gmail.com', 'jameboylabiste58@gmail.com',
            'jimboylucero16@gmail.com', 'leovyfavilajr@gmail.com', 'capistranoacads@gmail.com', 'wyngardatienza11@gmail.com',
            'ivanpaca17@gmail.com', 'bantilesjoephilipjr@gmail.com', 'yaonvince@gmail.com', 'yarennary@gmail.com',
            'pauledar2008@gmail.com', 'miagacharls60@gmail.com', 'kentjahrein@gmail.com', 'jenbertnuique03@gmail.com',
            'gian.roosevelt14@gmail.com', 'franzindalumpines7@gmail.com', 'ninioruaya14@gmail.com', 'mendolajhaymark@gmail.com',
            'celestinocubijr@gmail.com', 'akherlopez1027@gmail.com', 'jibreelatomar2@gmail.com', 'justinelee.fs@gmail.com',
            'cunananalliyahdennise@gmail.com', 'edmarkbryandaps@gmail.com', 'william.delosreyes2006@gmail.com', 'francis.lamberte@evsu.edu.ph',
            'giomerfeliciano11@gmail.com', 'budzathrunskey14356@gmail.com', 'renzosode22@gmail.com', 'leemaro509@gmail.com',
            'drylleignacio17@gmail.com', 'faermadjad@gmail.com', 'sorianoandrielloyd13@gmail.com', 'edwardarroyo1122@gmail.com',
            'geraldalegre712@gmail.com', 'jasaldavia@pcu.edu.ph', 'stevenfactor75@gmail.com', 'domsclarence@gmail.com',
            'princecarlobrina16@gmail.com', 'ranlidacalos738@gmail.com', 'jaybelbes123@gmail.com', 'richardsangines2@gmail.com',
            'deanloydverde4@gmail.com', 'kobzakmad@gmail.com', 'johnpatrickdeuna8@gmail.com', 'lloydgolondrina5@gmail.com',
            'baguioanthony009@gmail.com', 'wcaguilar@paterostechnologicalcollege.edu.ph', 'tapayanjaybee@gmail.com', 'karlbugaling@gmail.com',
            'andriealonzo84@gmail.com', 'bagares.gemar09@gmail.com', 'datumohirjack24@gmail.com', 'aljasserrahaman7@gmail.com',
            'rhaiedabubakar@gmail.com', 'jokksamia@gmail.com', 'pelinoalexander354@gmail.com', 'lylematandog3@gmail.com',
            'kentasleyborres492@gmail.com', 'danahiezernasayao@gmail.com', 'earlaahm@gmail.com', 'dalisaymaclaurence@gmail.com',
            'aljamelsultan@gmail.com', 'macatumbaskylle12@gmail.com', 'geraldezcyril16@gmail.com', 'jeroldrojas2004@gmail.com',
            'egieedpalina8@gmail.com', 'babiarachelanne@gmail.com', 'markrenzodelacruz36@gmail.com', 'brianrussellepadilla13@gmail.com',
            'jaminaranzel@gmail.com', 'edrickpintor@gmail.com', 'matiradranreb9@gmail.com', '22-09746@g.batstate-u.edu.ph',
            'josephlenonlamit@gmail.com', 'cndlrmatt@gmail.com', 'regiecasas30@gmail.com', 'kiannoche4@gmail.com',
            'torrescharleskent8@gmail.com', 'lanceoliverd@gmail.com', 'jhustine619@gmail.com', 'yuuftliampier@gmail.com',
            'kingjanuadumpa@gmail.com', 'andreivaldeztamonabrina@gmail.com', 'cantillerjotherezyaeljan@gmail.com', 'argilgreg7@gmail.com',
            'segmundvelasco@gmail.com', 'ceballosalf33@gmail.com', 'richelle.laurizen@gmail.com', 'arnarniele@gmail.com',
            'julianrossholgado3rd@gmail.com', 'janusgratiae15@gmail.com', 'johnwilfredamoguis@gmail.com', 'taniojameer@gmail.com',
            'morandantemattjireh@gmail.com', 'tidzkie332211@gmail.com', 'astriancastro93@gmail.com', 'sicnarfd16@gmail.com',
            'fritzzyyy.centillas13@gmail.com', 'bobsboby583@gmail.com', 'charlesklanas08@gmail.com', 'angelojayvee23@gmail.com',
            'eryllecompanero20@gmail.com', 'zephyrisnotgood@gmail.com', 'josephmontuyamina@gmail.com', 's2025100604@firstasia.edu.ph',
            'radjethroy@gmail.com', 'wayneclarkz29@gmail.com', 'jaev.astillero.swu@phinmaed.com', 'tristancarldelapena@gmail.com',
            'acemontas538@gmail.com', 's2025109504@firstasia.edu.ph', 's2025108755@firstasia.edu.ph', 'clarencedeleus126@gmail.com',
            'betacurabambam@gmail.com', 'esperatyrn@gmail.com', 'encinakhennmikkel@gmail.com', 'fmiguelmontesco@gmail.com',
            'abdulzamad.an864@s.msumain.edu.ph', 'kristianregiea@gmail.com', 'samerdimaarig@gmail.com', 'jakebrandon.mercado17@gmail.com',
            'alucardyuzuke123@gmail.com', 'jhonbenedicttorresruba@gmail.com', 'hnor.alhusnie@gmail.com', 'knoxbullies.ml@gmail.com',
            'bea133862@gmail.com', 'mendoza.dp36@s.msumain.edu.ph', 'nasifimam303@gmail.com', 'ralphsabandal563@gmail.com',
            'aiciepadogdog6@gmail.com', 'stephenchadjuagpao@gmail.com', 'shainna.kim16@gmail.com', 'uttoarraofdalgan@gmail.com',
            'sairadatuimam423@gmail.com', 'suamenjustine2005@gmail.com', 'botoys36@gmail.com', 'kizamaurinmonte@gmail.com',
            'deanonalfred@gmail.com', 'rani972005@gmail.com', 'nilloahsley8@gmail.com', 'angeljazleenliquiran12345@gmail.com',
            'esposajohan@gmail.com', 'advinculae098@gmail.com', 'sanchezhannanicole03@gmail.com', 'reypuenleona@gmail.com',
            'bstm.hermosillaja@gmail.com', 'kyleyambao79@gmail.com', 'jonasmacusi4@gmail.com', 'neillagunay716@gmail.com',
            'jelee2162val@student.fatima.edu.ph', 'garciajohnmichael894@gmail.com', 'jmlee8139@gmail.com', 'roljohnkentflores@gmail.com',
            'christianelielpailma@gmail.com', 'kevinkurtdeguzman20@gmail.com', 'pastolerojayson09@gmail.com', 'jielofernandez32@gmail.com',
            'johnrobertocruz02@gmail.com', 'bsentrep.salinojrp@gmail.com', 'aarondeblois96@gmail.com', 'johnrichplaza12@gmail.com',
            'bsemc.lobitanajayl@gmail.com', 'egeecampusano@gmail.com', 'tamayojamesrusty18@gmail.com', 'jodieannemeterio@gmail.com',
            'lhestertaperla@gmail.com', 'frickzwenzeleder@gmail.com', 'jameseichi139@gmail.com', 'westleecatalan3@gmail.com',
            'reynaldlauzon14@gmail.com', 'bsemc.villarazajohnbrylel@gmail.com', 'sethleonardsanpedro@gmail.com', 'vincentsanpascual4@gmail.com',
            'jrmanarang14@gmail.com', 'gremiorich3@gmail.com', 'ortinerojumong@gmail.com', 'aldwinedison16@gmail.com',
            'pgreroma.ccsjdm@gmail.com', 'carltumanda5@gmail.com', 'johncarldomina@gmail.com', 'franzzenbenitez@gmail.com',
            'markkenneth0914@gmail.com'
        ];
    }

    public function bulkDeleteUsers(Request $request)
    {
        if (!$request->session()->get('user_management_authorized')) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        $request->validate([
            'user_ids' => 'required|array',
            'user_ids.*' => 'integer|exists:users,id'
        ]);

        $userIds = $request->input('user_ids');

        try {
            DB::beginTransaction();
            $deletedCount = User::whereIn('id', $userIds)->delete();
            DB::commit();

            return response()->json([
                'success' => true,
                'message' => "Successfully deleted {$deletedCount} users.",
                'deleted_count' => $deletedCount
            ]);
        }
        catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Error deleting users: ' . $e->getMessage()
            ], 500);
        }
    }
}
