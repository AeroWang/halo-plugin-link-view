package run.halo.starter.endpoint;


import static org.springframework.web.reactive.function.server.RequestPredicates.GET;
import static org.springframework.web.reactive.function.server.RequestPredicates.queryParam;
import static org.springframework.web.reactive.function.server.RouterFunctions.route;

import java.io.IOException;
import java.net.MalformedURLException;
import java.net.URL;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.core.context.ReactiveSecurityContextHolder;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.reactive.function.server.RouterFunction;
import org.springframework.web.reactive.function.server.ServerRequest;
import org.springframework.web.reactive.function.server.ServerResponse;
import reactor.core.publisher.Mono;
import run.halo.starter.domain.R;
import run.halo.starter.domain.WebsiteInfo;

@RequiredArgsConstructor
@Slf4j
@Configuration(proxyBeanMethods = false)
public class UserEndpoint {

    @Bean
    RouterFunction<ServerResponse> queryWebsiteInfoRoute(){
        return route(GET("/link-view/api/parse-web"), this::queryWebsiteInfo);
    }

    private Mono<ServerResponse> queryWebsiteInfo(ServerRequest request) {
        if(!isAuthorized()){
            return ServerResponse.badRequest().bodyValue("Unauthorized");
        }

        log.info("Query website info");

        final Optional<String> url = request.queryParam("url");
        if(url.isEmpty()){
            return ServerResponse.ok().bodyValue("need url");
        }
        final String urlStr = url.get();
        Document document = null;
        try {
            document = Jsoup.parse(new URL(urlStr), 3000);
        }catch (IOException e){
            log.error("Malformed URL");
        }
        if(document == null){
            return ServerResponse.badRequest().bodyValue("Malformed URL");
        }
        var title = document.title();
        var favicon = document.select("link[rel='icon']").attr("href");
        if(favicon.charAt(0) == '/'){
            try {
                favicon = new URL(new URL(urlStr), favicon).toString();
            }catch (MalformedURLException e){
                log.error("favicon URL error");
            }
        }
        var description = document.select("meta[name='description']").attr("content");
        WebsiteInfo info = WebsiteInfo.builder()
            .title(title)
            .iconUrl(favicon)
            .description(description)
            .build();

        return ServerResponse.ok().bodyValue(R.success(info));
    }

    private boolean isAuthorized(){
        return true;
    }
}
